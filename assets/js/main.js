import { initComponents, initNavbarEffects } from './modules/components.js';
import { initCountingAnimation } from './modules/stats.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Load all components
    await initComponents();

    // Initialize navbar effects
    initNavbarEffects();
    
    // Initialize stats counter animation
    initCountingAnimation();
});