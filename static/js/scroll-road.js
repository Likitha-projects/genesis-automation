document.addEventListener('DOMContentLoaded', () => {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (isTouchDevice || prefersReducedMotion) {
        return; // Disable on touch/reduced motion
    }
    
    const roadContainer = document.getElementById('scroll-road-container');
    if (!roadContainer) return;
    
    // The road line
    const roadSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    roadSvg.setAttribute('viewBox', '0 0 10 1000');
    roadSvg.style.position = 'absolute';
    roadSvg.style.top = '0';
    roadSvg.style.left = '50%';
    roadSvg.style.transform = 'translateX(-50%)';
    roadSvg.style.width = '10px';
    roadSvg.style.height = '100%';
    roadSvg.style.zIndex = '1';
    
    const roadPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    // Straight line path for studio showcase
    roadPath.setAttribute('d', 'M5,0 L5,1000');
    roadPath.setAttribute('stroke', 'rgba(255,255,255,0.05)');
    roadPath.setAttribute('stroke-width', '2');
    roadPath.setAttribute('fill', 'none');
    // Dashed line
    roadPath.setAttribute('stroke-dasharray', '20, 10');
    
    roadSvg.appendChild(roadPath);
    roadContainer.appendChild(roadSvg);
    
    // The car
    const car = document.createElement('div');
    car.innerHTML = `
        <svg viewBox="0 0 100 200" width="20" height="40">
            <path d="M20,30 L80,30 C90,30 95,40 95,50 L95,150 C95,160 90,170 80,170 L20,170 C10,170 5,160 5,150 L5,50 C5,40 10,30 20,30 Z" fill="#C9A227"/>
            <path d="M25,50 L75,50 L70,80 L30,80 Z" fill="#000" opacity="0.5"/>
            <path d="M25,150 L75,150 L70,120 L30,120 Z" fill="#000" opacity="0.5"/>
        </svg>
    `;
    car.style.position = 'absolute';
    car.style.top = '0';
    car.style.left = '50%';
    car.style.transform = 'translate(-50%, -50%)'; // Center it
    car.style.zIndex = '2';
    car.style.transition = 'top 0.1s ease-out';
    
    roadContainer.appendChild(car);
    
    window.addEventListener('scroll', () => {
        // Calculate scroll percentage
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.body.scrollHeight;
        
        let scrollPercent = scrollPosition / (documentHeight - windowHeight);
        // Clamp to 0-1
        scrollPercent = Math.max(0, Math.min(1, scrollPercent));
        
        // Move car down the container
        const containerHeight = roadContainer.clientHeight;
        car.style.top = `${scrollPercent * containerHeight}px`;
        
        // Slight wobble/nudge effect on scroll
        const wobble = Math.sin(scrollPosition * 0.05) * 5;
        car.style.transform = `translate(calc(-50% + ${wobble}px), -50%) rotate(${wobble * 0.5}deg)`;
    }, { passive: true });
});
