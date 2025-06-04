export async function loadComponent(containerId, componentPath) {
    try {
        const response = await fetch(componentPath);
        const html = await response.text();
        document.getElementById(containerId).innerHTML = html;
    } catch (error) {
        console.error(`Error loading component ${componentPath}:`, error);
    }
}

export async function initComponents() {
    await Promise.all([
        loadComponent('navbar-container', '../components/navbar.html'),
        loadComponent('hero-container', '../components/hero.html'),
        loadComponent('stats-container', '../components/stats-cards.html'),
        loadComponent('form-container', '../components/campaign-form.html'),
        loadComponent('footer', '../components/footer.html')
    ]);
}

export function initNavbarEffects() {
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar-custom');
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
    
    // Hide/Show navbar on scroll
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add box-shadow after scrolling
        if (currentScroll > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
        
        // Hide/Show based on scroll direction
        if (currentScroll > lastScroll && currentScroll > 300) {
            navbar.classList.add('navbar-hidden');
        } else {
            navbar.classList.remove('navbar-hidden');
        }
        
        lastScroll = currentScroll;
    });
}   