import { initComponents, initNavbarEffects, loadComponent } from './modules/components.js';
import { initCountingAnimation } from './modules/stats.js';
import { handleLogout } from './modules/auth.js';
import { handleAddCampaign, getCampaigns, renderCampaigns } from './modules/campaign.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Load all components
    await initComponents();

    // Initialize navbar effects
    initNavbarEffects();

    initCountingAnimation();
    
    // Add logout handler
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
        });
    }

    // Add campaign form handler
    const campaignForm = document.querySelector('.form-section form');
    if (campaignForm) {
        campaignForm.addEventListener('submit', handleAddCampaign);
    }

    // Check if we're on the campaign list page
    const campaignListContainer = document.getElementById('campaign-list-container');
    if (campaignListContainer) {
        try {
            // Load campaign list component
            await loadComponent('campaign-list-container', '../components/campaign-list.html');
            
            // Fetch and render campaigns
            const campaigns = await getCampaigns();
            console.log('Fetched campaigns:', campaigns);
            
            if (campaigns && campaigns.length > 0) {
                renderCampaigns(campaigns);
                
                // Add filter functionality
                const statusFilter = document.getElementById('statusFilter');
                if (statusFilter) {
                    statusFilter.addEventListener('change', (e) => {
                        const filtered = campaigns.filter(campaign => 
                            !e.target.value || campaign.status === e.target.value
                        );
                        renderCampaigns(filtered);
                    });
                }
            } else {
                // Show empty state if no campaigns
                const emptyState = document.getElementById('emptyState');
                if (emptyState) {
                    emptyState.classList.remove('d-none');
                }
            }
        } catch (error) {
            console.error('Error loading campaign list:', error);
        }
    }
});