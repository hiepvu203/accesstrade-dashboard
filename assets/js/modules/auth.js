const handleLogin = async (event) => {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    try {
        const res = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
            if (rememberMe) {
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
            } else {
                sessionStorage.setItem('accessToken', data.accessToken);
                sessionStorage.setItem('refreshToken', data.refreshToken);
            }
            window.location.href = 'index.html';
        } else {
            alert(data.message || 'Login fails!');
        }
    } catch (error) {
        alert('Error server!');
    }
};

const handleRegister = async (event) => {
    event.preventDefault();

    const email = document.getElementById('registerEmail').value;
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const res = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, username, password })
        });
        const data = await res.json();
        if (res.ok) {       
            alert('Đăng ký thành công! Vui lòng đăng nhập.');
            window.location.href = 'login.html';
        } else {
            alert(data.message || 'Đăng ký thất bại!');
        }
    } catch (error) {
        alert('Lỗi kết nối server!');
    }
};

const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    window.location.href = 'login.html';
};

export {
    handleLogin,
    handleRegister,
    handleLogout
};