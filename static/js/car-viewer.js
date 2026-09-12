function initCarViewer(containerId, options = {}) {
    const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!container) {
        console.warn(`[3D Studio] Container #${containerId} not found, will retry on DOM load.`);
        return null;
    }

    const THREE = (typeof window !== 'undefined' ? window.THREE : null) || (typeof globalThis !== 'undefined' ? globalThis.THREE : null);
    if (!THREE) {
        console.error('[3D Studio] Three.js is not loaded yet. Make sure three.min.js is included.');
        return null;
    }

    // Default configuration options
    const config = {
        carColor: options.carColor || options.initialColor || '#D4AF37', // Default Ignition Gold
        autoRotate: options.autoRotate !== false,
        allowControls: options.allowControls !== false,
        showUnderglow: options.showUnderglow !== false,
        showHeadlights: options.showHeadlights !== false,
        cameraDistance: options.cameraDistance || 6.2,
        ...options
    };

    // Clean previous canvases if re-initializing
    container.innerHTML = '';

    // Guarantee minimum render dimensions even if container hasn't calculated bounding rect
    const width = container.clientWidth || container.offsetWidth || (container.parentElement ? container.parentElement.clientWidth : 600) || 600;
    const height = container.clientHeight || container.offsetHeight || 450;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#08090B');

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(4.8, 2.0, 4.8);
    camera.lookAt(0, 0.55, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    if (THREE.ACESFilmicToneMapping) {
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.3;
    }
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Orbit Controls
    let controls = null;
    const ControlsClass = THREE.OrbitControls || (typeof OrbitControls !== 'undefined' ? OrbitControls : null);
    if (config.allowControls && ControlsClass) {
        try {
            controls = new ControlsClass(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.06;
            controls.minDistance = 3.2;
            controls.maxDistance = 11.0;
            controls.maxPolarAngle = Math.PI / 2 - 0.03; // Keep slightly above floor
            controls.minPolarAngle = 0.2;
            controls.target.set(0, 0.55, 0);
            controls.update();
        } catch (err) {
            console.warn('[3D Studio] OrbitControls init failed, continuing without controls:', err);
        }
    }

    // Studio Lighting (Balanced showroom studio)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Overhead Studio Key Light
    const keyLight = new THREE.DirectionalLight(0xfff8ee, 1.5);
    keyLight.position.set(5, 7, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Front Subtle Fill Light
    const fillLight = new THREE.DirectionalLight(0xD4AF37, 0.6);
    fillLight.position.set(-5, 5, 3);
    scene.add(fillLight);

    // Cyan/Gold Rim Lights
    const rimLight1 = new THREE.DirectionalLight(0x00F0FF, 1.2);
    rimLight1.position.set(-5, 3, -4);
    scene.add(rimLight1);

    const rimLight2 = new THREE.DirectionalLight(0xD4AF37, 1.0);
    rimLight2.position.set(5, 3, -4);
    scene.add(rimLight2);

    // Reflective Circular Studio Floor (Dark Obsidian)
    const floorGeo = new THREE.CircleGeometry(10, 64);
    const floorMat = new THREE.MeshPhongMaterial({
        color: 0x060709,
        specular: 0x1A1E29,
        shininess: 30,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.01;
    floor.receiveShadow = true;
    scene.add(floor);

    // Studio Grid Overlay on Floor (Subtle Gold & Charcoal)
    const grid = new THREE.GridHelper(16, 24, 0x8A7228, 0x141822);
    grid.position.y = 0.001;
    scene.add(grid);

    // Ground Shadow Soft Decal
    const shadowGeo = new THREE.PlaneGeometry(5.0, 2.6);
    const shadowMat = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.75,
    });
    const groundShadow = new THREE.Mesh(shadowGeo, shadowMat);
    groundShadow.rotation.x = -Math.PI / 2;
    groundShadow.position.y = 0.002;
    scene.add(groundShadow);

    // Master Car Group
    const carGroup = new THREE.Group();
    scene.add(carGroup);

    // Parse initial color
    let initialColorVal = config.carColor;
    if (typeof initialColorVal === 'string' && initialColorVal.startsWith('0x')) {
        initialColorVal = parseInt(initialColorVal, 16);
    }

    // Car Materials - High-Gloss Automotive Phong Shaders
    const bodyMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color(initialColorVal),
        specular: 0x554422,
        shininess: 70,
    });

    const carbonMaterial = new THREE.MeshPhongMaterial({
        color: 0x181A20,
        specular: 0x444444,
        shininess: 25,
    });

    const glassMaterial = new THREE.MeshPhongMaterial({
        color: 0x0A0D14,
        specular: 0xffffff,
        shininess: 120,
        transparent: true,
        opacity: 0.82,
    });

    const chromeMaterial = new THREE.MeshPhongMaterial({
        color: 0x7E8694,
        specular: 0xCCCCCC,
        shininess: 90,
    });

    const tireMaterial = new THREE.MeshPhongMaterial({
        color: 0x0E1014,
        specular: 0x222222,
        shininess: 8,
    });

    const headlightMaterial = new THREE.MeshBasicMaterial({
        color: 0x00F0FF,
    });

    const taillightMaterial = new THREE.MeshBasicMaterial({
        color: 0xFF1E40,
    });

    const caliperMaterial = new THREE.MeshPhongMaterial({
        color: 0xD4AF37,
        specular: 0xffffff,
        shininess: 80,
    });

    // BUILD PROCEDURAL SUPERCAR
    // 1. Lower Chassis
    const lowerChassisGeo = new THREE.BoxGeometry(4.2, 0.45, 1.9);
    const lowerChassis = new THREE.Mesh(lowerChassisGeo, bodyMaterial);
    lowerChassis.position.y = 0.45;
    lowerChassis.castShadow = true;
    lowerChassis.receiveShadow = true;
    carGroup.add(lowerChassis);

    // 2. Aerodynamic Front Hood & Nose Cone
    const noseGeo = new THREE.BoxGeometry(1.2, 0.28, 1.84);
    const nose = new THREE.Mesh(noseGeo, bodyMaterial);
    nose.position.set(1.95, 0.42, 0);
    nose.rotation.z = -0.12;
    nose.castShadow = true;
    carGroup.add(nose);

    // Front Carbon Splitter
    const splitterGeo = new THREE.BoxGeometry(0.7, 0.06, 2.02);
    const splitter = new THREE.Mesh(splitterGeo, carbonMaterial);
    splitter.position.set(2.2, 0.22, 0);
    splitter.castShadow = true;
    carGroup.add(splitter);

    // 3. Cabin & Glass Canopy
    const cabinGeo = new THREE.BoxGeometry(2.1, 0.58, 1.45);
    const cabin = new THREE.Mesh(cabinGeo, glassMaterial);
    cabin.position.set(-0.15, 0.92, 0);
    cabin.castShadow = true;
    carGroup.add(cabin);

    // Cabin Roof Panel
    const roofGeo = new THREE.BoxGeometry(1.8, 0.05, 1.35);
    const roof = new THREE.Mesh(roofGeo, bodyMaterial);
    roof.position.set(-0.2, 1.22, 0);
    roof.castShadow = true;
    carGroup.add(roof);

    // 4. Rear Fastback Deck & Diffuser
    const rearDeckGeo = new THREE.BoxGeometry(1.1, 0.38, 1.84);
    const rearDeck = new THREE.Mesh(rearDeckGeo, bodyMaterial);
    rearDeck.position.set(-1.65, 0.58, 0);
    rearDeck.rotation.z = 0.16;
    rearDeck.castShadow = true;
    carGroup.add(rearDeck);

    // Rear Carbon Diffuser
    const diffuserGeo = new THREE.BoxGeometry(0.6, 0.18, 1.95);
    const diffuser = new THREE.Mesh(diffuserGeo, carbonMaterial);
    diffuser.position.set(-2.15, 0.28, 0);
    diffuser.castShadow = true;
    carGroup.add(diffuser);

    // GT Rear Wing Spoiler
    const wingGeo = new THREE.BoxGeometry(0.4, 0.05, 1.9);
    const wing = new THREE.Mesh(wingGeo, carbonMaterial);
    wing.position.set(-2.0, 1.05, 0);
    wing.castShadow = true;
    carGroup.add(wing);

    // Wing Struts
    const strutGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.3);
    const strutLeft = new THREE.Mesh(strutGeo, carbonMaterial);
    strutLeft.position.set(-2.0, 0.9, 0.5);
    carGroup.add(strutLeft);
    const strutRight = new THREE.Mesh(strutGeo, carbonMaterial);
    strutRight.position.set(-2.0, 0.9, -0.5);
    carGroup.add(strutRight);

    // 5. Dual Polished Exhausts
    const exhaustGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.25, 16);
    const exhaustLeft = new THREE.Mesh(exhaustGeo, chromeMaterial);
    exhaustLeft.rotation.z = Math.PI / 2;
    exhaustLeft.position.set(-2.2, 0.35, 0.45);
    carGroup.add(exhaustLeft);

    const exhaustRight = new THREE.Mesh(exhaustGeo, chromeMaterial);
    exhaustRight.rotation.z = Math.PI / 2;
    exhaustRight.position.set(-2.2, 0.35, -0.45);
    carGroup.add(exhaustRight);

    // 6. LED Headlights & Taillights
    const headlightGeo = new THREE.BoxGeometry(0.08, 0.08, 0.38);
    const headlightLeft = new THREE.Mesh(headlightGeo, headlightMaterial);
    headlightLeft.position.set(2.48, 0.5, 0.68);
    carGroup.add(headlightLeft);

    const headlightRight = new THREE.Mesh(headlightGeo, headlightMaterial);
    headlightRight.position.set(2.48, 0.5, -0.68);
    carGroup.add(headlightRight);

    // Taillight Blade
    const taillightGeo = new THREE.BoxGeometry(0.05, 0.08, 1.7);
    const taillight = new THREE.Mesh(taillightGeo, taillightMaterial);
    taillight.position.set(-2.15, 0.68, 0);
    carGroup.add(taillight);

    // 7. Wheels & Brembo Calipers
    const wheelGroup = new THREE.Group();
    carGroup.add(wheelGroup);

    const wheelPositions = [
        [1.35, 0.35, 0.98],   // Front Right
        [1.35, 0.35, -0.98],  // Front Left
        [-1.35, 0.35, 0.98],  // Rear Right
        [-1.35, 0.35, -0.98]  // Rear Left
    ];

    const wheelRadius = 0.36;
    const wheelWidth = 0.24;

    wheelPositions.forEach(pos => {
        const singleWheel = new THREE.Group();
        singleWheel.position.set(...pos);

        // Tire
        const tireGeo = new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelWidth, 24);
        const tire = new THREE.Mesh(tireGeo, tireMaterial);
        tire.rotation.x = Math.PI / 2;
        tire.castShadow = true;
        singleWheel.add(tire);

        // Metallic Multi-Spoke Rim
        const rimGeo = new THREE.CylinderGeometry(wheelRadius * 0.74, wheelRadius * 0.74, wheelWidth * 0.88, 16);
        const rim = new THREE.Mesh(rimGeo, chromeMaterial);
        rim.rotation.x = Math.PI / 2;
        singleWheel.add(rim);

        // Center Wheel Hub Cap
        const hubGeo = new THREE.CylinderGeometry(wheelRadius * 0.3, wheelRadius * 0.3, wheelWidth * 0.94, 12);
        const hub = new THREE.Mesh(hubGeo, carbonMaterial);
        hub.rotation.x = Math.PI / 2;
        singleWheel.add(hub);

        // Gold Brake Caliper
        const caliperGeo = new THREE.BoxGeometry(0.12, 0.18, 0.08);
        const caliper = new THREE.Mesh(caliperGeo, caliperMaterial);
        caliper.position.set(0.12, 0.08, 0);
        singleWheel.add(caliper);

        wheelGroup.add(singleWheel);
    });

    // 8. Cyan Underglow Light
    let underglowLight = null;
    if (config.showUnderglow) {
        underglowLight = new THREE.PointLight(0x00F0FF, 3.5, 3.8);
        underglowLight.position.set(0, 0.15, 0);
        carGroup.add(underglowLight);
    }

    // Animation & Controls State
    let isInteracting = false;
    let interactionTimer = null;

    if (controls) {
        controls.addEventListener('start', () => {
            isInteracting = true;
            if (interactionTimer) clearTimeout(interactionTimer);
        });
        controls.addEventListener('end', () => {
            interactionTimer = setTimeout(() => {
                isInteracting = false;
            }, 3000);
        });
    }

    // Mouse Parallax for Hero
    let targetTiltX = 0;
    let targetTiltZ = 0;
    const onMouseMove = (e) => {
        const rect = container.getBoundingClientRect();
        const mouseNormX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const mouseNormY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        targetTiltX = mouseNormY * 0.08;
        targetTiltZ = mouseNormX * 0.12;
    };
    container.addEventListener('mousemove', onMouseMove);

    // Responsive Resizing
    const onResize = () => {
        if (!container) return;
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        if (newWidth === 0 || newHeight === 0) return;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', onResize);

    // Clock
    const clock = new THREE.Clock();

    // Render Loop
    let animationFrameId = null;
    function animate() {
        animationFrameId = requestAnimationFrame(animate);

        const delta = clock.getDelta();

        if (controls) controls.update();

        // Auto rotation when idle
        if (config.autoRotate && !isInteracting) {
            carGroup.rotation.y += delta * 0.45;
        }

        // Smooth subtle suspension breathing
        carGroup.position.y = Math.sin(clock.getElapsedTime() * 2) * 0.015;

        // Parallax damping
        carGroup.rotation.x += (targetTiltX - carGroup.rotation.x) * 0.05;
        carGroup.rotation.z += (targetTiltZ - carGroup.rotation.z) * 0.05;

        renderer.render(scene, camera);
    }

    animate();

    // Public Controller Methods returned to page
    const controller = {
        setColor: (hexColor) => {
            let col = hexColor;
            if (typeof col === 'string' && col.startsWith('0x')) {
                col = parseInt(col, 16);
            }
            bodyMaterial.color.set(col);
        },
        toggleWireframe: (enable) => {
            bodyMaterial.wireframe = enable;
        },
        toggleHeadlights: (enable) => {
            headlightMaterial.color.set(enable ? 0x00F0FF : 0x222222);
        },
        toggleUnderglow: (enable) => {
            if (underglowLight) underglowLight.intensity = enable ? 3.5 : 0;
        },
        destroy: () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', onResize);
            container.removeEventListener('mousemove', onMouseMove);
            renderer.dispose();
            container.innerHTML = '';
        }
    };

    // Also attach to window for inline onclick/scripts
    window.genesisActiveViewer = controller;
    window.changeCarColor = (hex) => controller.setColor(hex);
    window.toggleWireframe = (en) => {
        const nextState = typeof en === 'boolean' ? en : !bodyMaterial.wireframe;
        controller.toggleWireframe(nextState);
        return nextState;
    };

    return controller;
}

// Universal window exposure
if (typeof window !== 'undefined') {
    window.initCarViewer = initCarViewer;
}

