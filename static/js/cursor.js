document.addEventListener('DOMContentLoaded', () => {
    // Check for touch devices / reduced motion
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (isTouchDevice || prefersReducedMotion) {
        return; // Disable custom cursor
    }
    
    // Create cursor container
    const cursorContainer = document.createElement('div');
    cursorContainer.id = 'custom-car-cursor';
    cursorContainer.style.position = 'fixed';
    cursorContainer.style.pointerEvents = 'none';
    cursorContainer.style.zIndex = '9999';
    cursorContainer.style.top = '0';
    cursorContainer.style.left = '0';
    cursorContainer.style.transition = 'transform 0.1s ease-out';
    
    // Create car SVG (sleek sports car silhouette)
    const carSvg = document.createElement('div');
    carSvg.innerHTML = `
        <svg viewBox="0 0 100 200" width="28" height="56" style="transform-origin: center center; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.5));">
            <!-- Shadow/Base -->
            <path d="M15,40 C15,20 85,20 85,40 L90,160 C90,180 10,180 10,160 Z" fill="rgba(0,0,0,0.4)" transform="translate(0, 4)"/>
            
            <!-- Body Main -->
            <path d="M20,35 C20,15 80,15 80,35 L88,150 C88,180 12,180 12,150 Z" class="car-body" fill="#C9CDD3" style="transition: fill 0.3s ease;"/>
            
            <!-- Front Bumper Detail -->
            <path d="M30,15 Q50,20 70,15 L75,25 Q50,30 25,25 Z" fill="#16181C" opacity="0.8"/>
            
            <!-- Windshield -->
            <path d="M28,60 C28,45 72,45 72,60 L68,85 L32,85 Z" fill="#0A0B0D"/>
            <path d="M30,62 C30,50 70,50 70,62 L66,83 L34,83 Z" fill="#16181C"/> <!-- Glass reflection -->
            
            <!-- Roof -->
            <path d="M32,85 L68,85 L65,115 L35,115 Z" fill="rgba(255,255,255,0.1)"/>
            
            <!-- Rear Window -->
            <path d="M35,115 L65,115 L70,140 C70,145 30,145 30,140 Z" fill="#0A0B0D"/>
            
            <!-- Taillights -->
            <path d="M15,160 Q25,162 35,160 L35,165 Q25,167 15,165 Z" fill="#ff2a2a" class="taillight" style="transition: filter 0.2s ease, fill 0.2s ease;"/>
            <path d="M85,160 Q75,162 65,160 L65,165 Q75,167 85,165 Z" fill="#ff2a2a" class="taillight" style="transition: filter 0.2s ease, fill 0.2s ease;"/>
        </svg>
    `;
    
    // Create exhaust particles container
    const exhaustContainer = document.createElement('div');
    exhaustContainer.style.position = 'absolute';
    exhaustContainer.style.left = '14px';
    exhaustContainer.style.top = '56px'; // At the rear
    
    cursorContainer.appendChild(carSvg);
    cursorContainer.appendChild(exhaustContainer);
    
    // Hide default cursor on body
    document.body.style.cursor = 'none';
    document.body.appendChild(cursorContainer);
    
    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => cursorContainer.style.opacity = '0');
    document.addEventListener('mouseenter', () => cursorContainer.style.opacity = '1');
    
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    let targetRotation = 0;
    let currentRotation = 0;
    let velocity = 0;
    let isBraking = false;
    
    document.addEventListener('mousemove', (e) => {
        // Calculate velocity based on jump distance
        const dx = e.clientX - mouseX;
        const dy = e.clientY - mouseY;
        velocity = Math.sqrt(dx*dx + dy*dy);
        
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Taillights light up when stopping/moving slowly after moving fast
        isBraking = velocity < 2;
        updateTaillights(isBraking);
        
        if (velocity > 15 && Math.random() > 0.5) {
            createExhaust();
        }
    });
    
    const bodyPath = cursorContainer.querySelector('.car-body');
    const taillights = cursorContainer.querySelectorAll('.taillight');
    
    function updateTaillights(braking) {
        taillights.forEach(tl => {
            tl.style.fill = braking ? '#ff0000' : '#ff2a2a';
            tl.style.filter = braking ? 'drop-shadow(0 0 4px #ff0000)' : 'none';
        });
    }
    
    // Squish on click
    document.addEventListener('mousedown', () => {
        cursorContainer.style.transform = `translate3d(${cursorX - 14}px, ${cursorY - 28}px, 0) rotate(${currentRotation}rad) scale(0.9)`;
        updateTaillights(true);
    });
    document.addEventListener('mouseup', () => {
        cursorContainer.style.transform = `translate3d(${cursorX - 14}px, ${cursorY - 28}px, 0) rotate(${currentRotation}rad) scale(1)`;
        updateTaillights(false);
    });
    
    // Hover targets styling
    const hoverTargets = document.querySelectorAll('a, button, input, select, textarea');
    hoverTargets.forEach(target => {
        target.style.cursor = 'none'; // Keep system cursor hidden over links
        target.addEventListener('mouseenter', () => {
            bodyPath.style.fill = '#C9A227'; // ignition-gold
            bodyPath.style.filter = 'drop-shadow(0 0 10px rgba(201,162,39,0.8))';
        });
        target.addEventListener('mouseleave', () => {
            bodyPath.style.fill = '#C9CDD3'; // platinum
            bodyPath.style.filter = 'none';
        });
    });
    
    function createExhaust() {
        const isNitro = velocity > 18;
        const leftExhaust = document.createElement('div');
        const rightExhaust = document.createElement('div');
        
        [leftExhaust, rightExhaust].forEach((particle, idx) => {
            const isRight = idx === 1;
            particle.style.width = isNitro ? '5px' : '4px';
            particle.style.height = isNitro ? '5px' : '4px';
            particle.style.background = isNitro 
                ? (Math.random() > 0.5 ? 'rgba(0, 240, 255, 0.9)' : 'rgba(212, 175, 55, 0.9)')
                : 'rgba(255, 255, 255, 0.4)';
            particle.style.borderRadius = '50%';
            particle.style.position = 'absolute';
            particle.style.left = isRight ? '7px' : '-7px';
            particle.style.top = '0';
            particle.style.pointerEvents = 'none';
            if (isNitro) {
                particle.style.boxShadow = '0 0 8px rgba(0, 240, 255, 0.8)';
            }
            
            const spreadX = (Math.random() - 0.5) * (isNitro ? 8 : 12) + (isRight ? 2 : -2);
            const spreadY = Math.random() * 24 + (isNitro ? 16 : 8);
            
            particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: isNitro ? 1 : 0.6 },
                { transform: `translate(${spreadX}px, ${spreadY}px) scale(${isNitro ? 2.5 : 2})`, opacity: 0 }
            ], {
                duration: 350 + Math.random() * 200,
                easing: 'cubic-bezier(0, .9, .57, 1)'
            });
            
            exhaustContainer.appendChild(particle);
            setTimeout(() => particle.remove(), 550);
        });
    }
    
    function animate() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.2;
        cursorY += dy * 0.2;
        
        if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
            targetRotation = Math.atan2(dy, dx) + Math.PI / 2; // +90deg
            
            let deltaRot = targetRotation - currentRotation;
            while (deltaRot > Math.PI) deltaRot -= Math.PI * 2;
            while (deltaRot < -Math.PI) deltaRot += Math.PI * 2;
            
            currentRotation += deltaRot * 0.15;
        }
        
        cursorContainer.style.transform = `translate3d(${cursorX - 14}px, ${cursorY - 28}px, 0) rotate(${currentRotation}rad)`;
        
        requestAnimationFrame(animate);
    }
    
    animate();
});
