// Genesis Automotive Studio - High Octane Nitro Boost Loader & Page Transitions
(function() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Create Nitro Overlay Elements
    function createNitroLoader() {
        const existing = document.getElementById('nitro-loader-overlay');
        if (existing) return existing;

        const overlay = document.createElement('div');
        overlay.id = 'nitro-loader-overlay';
        overlay.className = 'fixed inset-0 z-[99999] bg-[#08090B] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-300 select-none';
        overlay.style.display = 'none';
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
        
        overlay.innerHTML = `
            <!-- Speed streaks background -->
            <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                <div class="speed-line line-1"></div>
                <div class="speed-line line-2"></div>
                <div class="speed-line line-3"></div>
                <div class="speed-line line-4"></div>
                <div class="speed-line line-5"></div>
            </div>

            <!-- Road perspective grid -->
            <div class="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-transparent via-[#14171F] to-transparent opacity-60 pointer-events-none" style="perspective: 400px;">
                <div class="w-full h-full border-b-2 border-[#D4AF37]/30 transform rotateX(60deg) scale-150 flex justify-center">
                    <div class="w-1 h-full bg-gradient-to-b from-transparent via-[#00F0FF] to-[#D4AF37] opacity-75 animate-pulse"></div>
                </div>
            </div>

            <!-- Center Stage: Car + Nitro Stage -->
            <div class="relative w-full max-w-xl flex flex-col items-center justify-center px-4" id="nitro-stage">
                
                <!-- HUD Telemetry Header -->
                <div class="flex items-center gap-3 mb-6 tracking-widest text-xs uppercase font-mono text-[#D4AF37]/90 font-bold">
                    <span class="w-2 h-2 rounded-full bg-[#00F0FF] animate-ping"></span>
                    <span id="nitro-status-text">GENESIS TUNING MATRIX // INITIALIZING</span>
                </div>

                <!-- Tachometer / Boost Gauge HUD -->
                <div class="w-72 sm:w-96 h-2 bg-[#161922] rounded-full overflow-hidden p-0.5 border border-white/10 mb-8 shadow-[0_0_15px_rgba(0,0,0,0.8)]">
                    <div id="nitro-progress-bar" class="h-full bg-gradient-to-r from-[#D4AF37] via-[#00F0FF] to-[#00F0FF] rounded-full transition-all duration-100 ease-out shadow-[0_0_12px_rgba(0,240,255,0.8)]" style="width: 5%;"></div>
                </div>

                <!-- Sports Car Silhouette with Nitro Boosters -->
                <div class="relative w-72 sm:w-88 h-32 flex items-center justify-center" id="nitro-car-wrapper">
                    <!-- Twin Nitro Exhaust Flames -->
                    <div id="nitro-flames" class="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-5 -translate-x-12 opacity-0 transition-opacity duration-200 pointer-events-none">
                        <div class="flame flame-top"></div>
                        <div class="flame flame-bottom"></div>
                    </div>

                    <!-- Sports Car SVG (Top-tier aggressive exotic coupe) -->
                    <svg class="w-full h-full drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)]" viewBox="0 0 320 120" fill="none" xmlns="http://www.w3.org/2000/svg" id="nitro-car-svg">
                        <!-- Neon Underglow -->
                        <ellipse cx="160" cy="98" rx="130" ry="10" fill="url(#cyanGlow)" class="nitro-underglow opacity-75" />

                        <!-- Wheels -->
                        <g class="wheel-group">
                            <!-- Rear Wheel -->
                            <circle cx="75" cy="85" r="22" fill="#0E1015" stroke="#252A34" stroke-width="4"/>
                            <circle cx="75" cy="85" r="16" fill="#14171F" stroke="#D4AF37" stroke-width="2" stroke-dasharray="6,4"/>
                            <circle cx="75" cy="85" r="7" fill="#252A34"/>
                            <!-- Brembo Gold Caliper -->
                            <rect x="68" y="67" width="12" height="7" rx="2" fill="#D4AF37"/>
                            
                            <!-- Front Wheel -->
                            <circle cx="245" cy="85" r="22" fill="#0E1015" stroke="#252A34" stroke-width="4"/>
                            <circle cx="245" cy="85" r="16" fill="#14171F" stroke="#D4AF37" stroke-width="2" stroke-dasharray="6,4"/>
                            <circle cx="245" cy="85" r="7" fill="#252A34"/>
                            <rect x="238" y="67" width="12" height="7" rx="2" fill="#D4AF37"/>
                        </g>

                        <!-- Aerodynamic Car Body -->
                        <!-- Main Chassis -->
                        <path d="M25 80 L50 82 Q65 60 95 82 L225 82 Q235 60 265 82 L295 82 Q310 80 310 73 C305 60 270 52 240 50 C210 40 180 30 135 30 C95 30 65 45 45 58 C30 68 25 75 25 80 Z" fill="url(#carBodyGrad)" stroke="#252A34" stroke-width="1.5"/>
                        
                        <!-- Roof & Windshield Glass -->
                        <path d="M100 52 L140 33 C175 33 195 38 215 50 L195 52 L100 52 Z" fill="#050608" stroke="#D4AF37" stroke-width="0.75" opacity="0.9"/>
                        <!-- Windshield Reflection -->
                        <path d="M125 36 L175 36 L160 50 L115 50 Z" fill="url(#windshieldGrad)" opacity="0.35"/>

                        <!-- Aggressive Rear Wing / Spoiler -->
                        <path d="M18 55 L35 50 L38 56 L20 60 Z" fill="#D4AF37"/>
                        <path d="M14 50 L45 48 L42 53 L12 55 Z" fill="#E5A93C"/>

                        <!-- Side Air Intake Scoop -->
                        <path d="M110 65 Q135 65 145 76 Q120 78 105 76 Z" fill="#08090B" stroke="#D4AF37" stroke-width="0.75"/>

                        <!-- Headlight Beam (Hyper LED) -->
                        <polygon points="295,68 312,71 310,75 292,72" fill="#00F0FF" class="headlight-core"/>
                        <polygon points="312,71 340,65 340,82 310,75" fill="url(#headlightBeam)" opacity="0.8"/>

                        <!-- Taillight Neon Blade -->
                        <rect x="22" y="70" width="8" height="4" rx="2" fill="#FF1E40" class="taillight-core" filter="drop-shadow(0 0 6px #FF1E40)"/>

                        <!-- Gradients -->
                        <defs>
                            <linearGradient id="carBodyGrad" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stop-color="#14171F"/>
                                <stop offset="50%" stop-color="#252A34"/>
                                <stop offset="85%" stop-color="#D4AF37"/>
                                <stop offset="100%" stop-color="#E5A93C"/>
                            </linearGradient>
                            <linearGradient id="windshieldGrad" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stop-color="#FFFFFF"/>
                                <stop offset="100%" stop-color="transparent"/>
                            </linearGradient>
                            <radialGradient id="cyanGlow" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stop-color="#00F0FF" stop-opacity="0.8"/>
                                <stop offset="50%" stop-color="#00F0FF" stop-opacity="0.3"/>
                                <stop offset="100%" stop-color="#00F0FF" stop-opacity="0"/>
                            </radialGradient>
                            <linearGradient id="headlightBeam" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stop-color="#00F0FF" stop-opacity="0.7"/>
                                <stop offset="100%" stop-color="#00F0FF" stop-opacity="0"/>
                            </linearGradient>
                        </defs>
                    </svg>
                </div>

                <!-- RPM & Speed Counters -->
                <div class="mt-6 flex items-center justify-between w-72 sm:w-96 text-xs font-mono font-bold text-[#94A3B8]">
                    <div>RPM: <span id="nitro-rpm" class="text-[#D4AF37]">1,200</span></div>
                    <div>MODE: <span class="text-[#00F0FF]">CORSA BOOST</span></div>
                    <div>BOOST: <span id="nitro-psi" class="text-white">0.0 PSI</span></div>
                </div>

                <!-- Skip button for rapid user navigation -->
                <button id="skip-nitro-btn" class="mt-8 text-xs tracking-widest text-[#94A3B8]/60 hover:text-white uppercase transition-colors px-4 py-1.5 rounded-full border border-white/10 hover:border-white/30">
                    Skip Intro &rarr;
                </button>
            </div>
        `;

        // Inject Styles for Nitro Flame, Streaks, & Shake
        const style = document.createElement('style');
        style.id = 'nitro-styles';
        style.textContent = `
            .speed-line {
                position: absolute;
                height: 1px;
                background: linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.7), transparent);
                width: 40%;
                animation: streakMove 0.8s linear infinite;
            }
            .line-1 { top: 20%; left: -20%; animation-delay: 0s; }
            .line-2 { top: 40%; left: -30%; animation-delay: 0.2s; width: 60%; }
            .line-3 { top: 65%; left: -10%; animation-delay: 0.4s; }
            .line-4 { top: 80%; left: -40%; animation-delay: 0.1s; width: 50%; }
            .line-5 { top: 30%; left: -15%; animation-delay: 0.3s; }

            @keyframes streakMove {
                0% { transform: translateX(0); opacity: 0; }
                50% { opacity: 1; }
                100% { transform: translateX(350%); opacity: 0; }
            }

            .flame {
                width: 55px;
                height: 14px;
                background: linear-gradient(270deg, #00F0FF, #00A3FF, #FFD200, #FF3D00);
                border-radius: 50% 0 0 50%;
                filter: drop-shadow(0 0 10px #00F0FF);
                transform-origin: right center;
                animation: flameBurn 0.08s infinite alternate;
            }
            .flame-bottom {
                width: 48px;
                height: 12px;
                animation-delay: 0.04s;
            }

            @keyframes flameBurn {
                0% { transform: scaleX(0.85) scaleY(0.9); filter: drop-shadow(0 0 8px #00F0FF); }
                100% { transform: scaleX(1.4) scaleY(1.15); filter: drop-shadow(0 0 16px #00F0FF); }
            }

            .engine-vibrate {
                animation: engineRev 0.05s infinite;
            }
            @keyframes engineRev {
                0% { transform: translate(0, 0); }
                25% { transform: translate(-1px, 1px); }
                50% { transform: translate(1px, -1px); }
                75% { transform: translate(-1px, -1px); }
                100% { transform: translate(1px, 1px); }
            }

            .car-launch {
                transition: transform 0.65s cubic-bezier(0.85, 0, 0.15, 1);
                transform: translateX(120vw) scale(1.05) !important;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(overlay);

        return overlay;
    }

    // Play Nitro Launch Sequence
    function runNitroSequence(isTransition = false, callback = null) {
        const overlay = createNitroLoader();
        if (!overlay) {
            if (callback) callback();
            return;
        }

        overlay.style.display = 'flex';
        void overlay.offsetWidth;
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'all';

        const carWrapper = document.getElementById('nitro-car-wrapper');
        const flames = document.getElementById('nitro-flames');
        const progressBar = document.getElementById('nitro-progress-bar');
        const statusText = document.getElementById('nitro-status-text');
        const rpmText = document.getElementById('nitro-rpm');
        const psiText = document.getElementById('nitro-psi');
        const skipBtn = document.getElementById('skip-nitro-btn');

        if (carWrapper) {
            carWrapper.classList.remove('car-launch');
            carWrapper.style.transform = 'translateX(0)';
        }

        const duration = 1200; // Crisp, fast 1.2s nitro transition
        const startTime = Date.now();

        // Vibration engine rev
        if (carWrapper) carWrapper.classList.add('engine-vibrate');

        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(1, elapsed / duration);

            if (progressBar) progressBar.style.width = `${Math.floor(progress * 100)}%`;

            // RPM & PSI ramp
            const currentRpm = Math.floor(1200 + progress * 7800);
            if (rpmText) rpmText.textContent = currentRpm.toLocaleString();
            if (psiText) psiText.textContent = (progress * 24.5).toFixed(1) + ' PSI';

            if (progress > 0.45 && flames) {
                flames.style.opacity = '1';
                if (statusText) {
                    statusText.textContent = 'STAGE 3 NITRO BOOST ENGAGED';
                    statusText.style.color = '#00F0FF';
                }
            }

            // Launch right before end
            if (progress > 0.72 && carWrapper && !carWrapper.classList.contains('car-launch')) {
                carWrapper.classList.remove('engine-vibrate');
                carWrapper.classList.add('car-launch');
            }

            if (progress >= 1) {
                clearInterval(interval);
                dismiss();
            }
        }, 25);

        function dismiss() {
            clearInterval(interval);
            if (carWrapper) carWrapper.classList.remove('engine-vibrate');
            overlay.style.pointerEvents = 'none';
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.display = 'none';
                if (callback) callback();
            }, 300);
        }

        if (skipBtn) {
            skipBtn.onclick = () => dismiss();
        }
    }

    // Global helper to trigger nitro transition before redirecting
    window.triggerNitroBoost = function(url, onComplete) {
        let completed = false;
        const doFinish = () => {
            if (completed) return;
            completed = true;
            if (url) {
                window.location.href = url;
            } else if (onComplete) {
                onComplete();
            }
        };

        // Guaranteed safety fallback after 1.4s
        const safetyTimer = setTimeout(doFinish, 1400);

        try {
            runNitroSequence(true, () => {
                clearTimeout(safetyTimer);
                doFinish();
            });
        } catch (err) {
            console.warn('[Nitro] Sequence error, falling back to direct navigation:', err);
            clearTimeout(safetyTimer);
            doFinish();
        }
    };

    // Attach to logout forms or back buttons automatically
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('a[data-nitro-transition]').forEach(link => {
            link.addEventListener('click', (e) => {
                const targetHref = link.getAttribute('href');
                if (targetHref && targetHref !== '#' && !targetHref.startsWith('javascript')) {
                    e.preventDefault();
                    window.triggerNitroBoost(targetHref);
                }
            });
        });
    });
})();
