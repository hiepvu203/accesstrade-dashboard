const validateForm = (formData) => {
    const errors = [];
    
    if (!formData.name || formData.name.length < 3) {
        errors.push('Tên chiến dịch phải có ít nhất 3 ký tự');
    }
    
    if (!formData.category) {
        errors.push('Vui lòng chọn danh mục');
    }
    
    const urlRegex = /^(https?:\/\/[^\s$.?#].[^\s]*)$/;
    if (!urlRegex.test(formData.targetUrl)) {
        errors.push('URL không hợp lệ');
    }
    
    if (formData.commission < 0 || formData.commission > 100) {
        errors.push('Hoa hồng phải từ 0-100%');
    }
    
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    if (endDate <= startDate) {
        errors.push('Ngày kết thúc phải sau ngày bắt đầu');
    }

    return errors;
};

const handleAddCampaign = async (event) => {
    event.preventDefault();
    
    const submitButton = event.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Đang xử lý...';

    try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
            showToast('error', 'Vui lòng đăng nhập để tạo chiến dịch!');
            window.location.href = 'login.html';
            return;
        }

        const formData = {
            name: document.getElementById('campaignName').value.trim(),
            category: document.getElementById('campaignCategory').value,
            targetUrl: document.getElementById('targetUrl').value.trim(),
            commission: parseFloat(document.getElementById('commission').value),
            description: document.getElementById('description').value.trim(),
            startDate: document.getElementById('startDate').value,
            endDate: document.getElementById('endDate').value,
            status: document.getElementById('status').value
        };

        // Validate form
        const errors = validateForm(formData);
        if (errors.length > 0) {
            showToast('error', errors[0]);
            return;
        }

        const response = await fetch('http://localhost:5000/api/campaign/addCampaign', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            showToast('success', 'Tạo chiến dịch thành công!');
            event.target.reset();
            window.location.href = 'list-campaign.html';
        } else {
            showToast('error', data.message || 'Tạo chiến dịch thất bại!');
        }
    } catch (error) {
        showToast('error', 'Lỗi kết nối server!');
        console.error('Error:', error);
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-save me-2"></i>Tạo chiến dịch';
    }
};

const showToast = (type, message) => {
    // Add toast notification library implementation here
    console.log(`${type}: ${message}`);
};

const getCampaigns = async () => {
    try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        showLoading(true);
        console.log('Fetching campaigns...'); // Debug log

        const response = await fetch('http://localhost:5000/api/campaign/myCampaigns', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        console.log('API response:', data); // Debug log

        if (response.ok) {
            return data;
        } else {
            throw new Error(data.message || 'Failed to fetch campaigns');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('error', error.message);
        return [];
    } finally {
        showLoading(false);
    }
};

const renderCampaigns = (campaigns) => {
    console.log('Rendering campaigns:', campaigns); // Debug log
    const container = document.querySelector('.campaign-grid');
    const emptyState = document.getElementById('emptyState');
    
    if (!container) {
        console.error('Campaign grid container not found');
        return;
    }

    if (!campaigns || !campaigns.length) {
        container.innerHTML = '';
        if (emptyState) {
            emptyState.classList.remove('d-none');
        }
        return;
    }

    if (emptyState) {
        emptyState.classList.add('d-none');
    }
    
    container.innerHTML = campaigns.map(campaign => `
        <div class="campaign-card ${campaign.status}">
            <div class="campaign-status">${getStatusBadge(campaign.status)}</div>
            <h3 class="campaign-title">${campaign.name}</h3>
            <div class="campaign-category">
                <i class="fas fa-tag me-2"></i>${campaign.category}
            </div>
            <div class="campaign-commission">
                <i class="fas fa-percentage me-2"></i>${campaign.commission}%
            </div>
            <div class="campaign-dates">
                <div><i class="fas fa-calendar-alt me-2"></i>${formatDate(campaign.startDate)}</div>
                <div><i class="fas fa-calendar-check me-2"></i>${formatDate(campaign.endDate)}</div>
            </div>
            <div class="campaign-actions">
                <button class="btn btn-sm btn-primary" onclick="handleEditCampaign('${campaign._id}')">
                    <i class="fas fa-edit me-1"></i>Sửa
                </button>
                <button class="btn btn-sm btn-danger" onclick="handleDeleteCampaign('${campaign._id}')">
                    <i class="fas fa-trash-alt me-1"></i>Xóa
                </button>
            </div>
        </div>
    `).join('');
};

const getStatusBadge = (status) => {
    const badges = {
        active: '<span class="badge bg-success">Đang hoạt động</span>',
        inactive: '<span class="badge bg-warning">Chưa kích hoạt</span>',
        expired: '<span class="badge bg-danger">Đã kết thúc</span>'
    };
    return badges[status] || badges.inactive;
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
};

const showLoading = (show) => {
    const loading = document.getElementById('loading');
    if (show) {
        loading.classList.remove('d-none');
    } else {
        loading.classList.add('d-none');
    }
};

export {
    handleAddCampaign,
    getCampaigns,
    renderCampaigns
};