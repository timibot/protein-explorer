// Purpose: Unified Frontend Controller for Protein Explorer.
// Handles: View switching, 3D biological model generation, and camera interaction.

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. UI VIEW TOGGLING LOGIC ---
    const btnDash = document.getElementById('btn-dashboard');
    const btnMin = document.getElementById('btn-minimalist');
    const dashView = document.getElementById('dashboard-view');
    const minView = document.getElementById('minimalist-view');

    // Attach click events to the buttons
    if (btnDash && btnMin) {
        btnDash.addEventListener('click', () => {
            dashView.style.display = 'flex';
            minView.style.display = 'none';
            btnDash.classList.add('active');
            btnMin.classList.remove('active');
        });

        btnMin.addEventListener('click', () => {
            dashView.style.display = 'none';
            minView.style.display = 'block';
            btnDash.classList.remove('active');
            btnMin.classList.add('active');
        });
    }

    // --- 2. 3D BIOLOGICAL RENDERING ENGINE ---
    const container = document.getElementById('canvas-container');

    // Safety Check: Only run 3D code if the results are on the screen
    if (container && typeof THREE !== 'undefined') {
        
        // --- SCENE SETUP ---
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        // --- CAMERA CONTROLS (ORBIT) ---
        // This allows clicking and dragging to rotate
        const OrbitController = THREE.OrbitControls || window.OrbitControls;
        let controls;
        
        if (OrbitController) {
            controls = new OrbitController(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
        }

        // --- PROTEIN MODEL GENERATION ---
        const proteinGroup = new THREE.Group();
        
        // CPK Colors: Grey (Carbon), Red (Oxygen), Blue (Nitrogen), Yellow (Sulfur)
        const cpkColors = [0x999999, 0xff3333, 0x3333ff, 0xffff00]; 
        let currentPoint = new THREE.Vector3(0, 0, 0);

        // We generate a "Ball and Stick" chain representing 40 atoms
        for (let i = 0; i < 40; i++) {
            const nextPoint = currentPoint.clone().add(new THREE.Vector3(
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 8
            ));

            // Create Atom (Sphere)
            const color = cpkColors[Math.floor(Math.random() * cpkColors.length)];
            const sphereGeo = new THREE.SphereGeometry(1.4, 16, 16);
            const sphereMat = new THREE.MeshPhongMaterial({ color: color, shininess: 80 });
            const sphere = new THREE.Mesh(sphereGeo, sphereMat);
            sphere.position.copy(nextPoint);
            proteinGroup.add(sphere);

            // Create Bond (Cylinder)
            if (i > 0) {
                const distance = currentPoint.distanceTo(nextPoint);
                const cylGeo = new THREE.CylinderGeometry(0.5, 0.5, distance, 8);
                const cylMat = new THREE.MeshPhongMaterial({ color: 0xdddddd });
                const cylinder = new THREE.Mesh(cylGeo, cylMat);
                
                // Position and orient the bond correctly between atoms
                cylinder.position.copy(currentPoint).lerp(nextPoint, 0.5);
                cylinder.quaternion.setFromUnitVectors(
                    new THREE.Vector3(0, 1, 0), 
                    nextPoint.clone().sub(currentPoint).normalize()
                );
                proteinGroup.add(cylinder);
            }
            currentPoint = nextPoint;
        }

        // Center the model so it doesn't rotate off-screen
        const box = new THREE.Box3().setFromObject(proteinGroup);
        const center = new THREE.Vector3();
        box.getCenter(center);
        proteinGroup.position.sub(center);
        
        scene.add(proteinGroup);

        // --- LIGHTING ---
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambientLight);
        
        const light = new THREE.PointLight(0xffffff, 1);
        light.position.set(20, 20, 20);
        scene.add(light);

        camera.position.z = 40;

        // --- ANIMATION LOOP ---
        function animate() {
            requestAnimationFrame(animate);
            
            // Subtle auto-rotation
            proteinGroup.rotation.y += 0.003;
            
            if (controls) controls.update();
            renderer.render(scene, camera);
        }
        
        animate();

        // Handle window resizing
        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
    }
});