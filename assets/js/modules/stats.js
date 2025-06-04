export function initCountingAnimation() {
    const countElements = document.querySelectorAll('.counting');
    
    countElements.forEach(element => {
        const target = parseInt(element.dataset.target);
        const duration = 2000; // 2 seconds
        const step = target / 200; // Update every 10ms
        
        let current = 0;
        const counter = setInterval(() => {
            current += step;
            element.textContent = Math.round(current).toLocaleString();
            
            if (current >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(counter);
            }
        }, 10);
    });
}