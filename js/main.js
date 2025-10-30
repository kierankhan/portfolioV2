import * as THREE from 'three';
import { gsap } from 'gsap';

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Get Elements ---
    const canvas = document.getElementById('cd-scene');
    const zoomWrapper = document.getElementById('zoomWrapper'); 
    const desktop = document.getElementById('desktop');
    const train = document.getElementById('trainContainer');

    // --- 2. Basic 3D Scene Setup ---
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, 1, 0.001, 1000); // Initial aspect ratio is 1

    const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        alpha: true
    });


    // --- 3. Create the CD ---
    
    // We'll create a Group to hold both layers.
    // We will spin this Group instead of a single mesh.
    const cdGroup = new THREE.Group();

    // This geometry will be shared by both layers
    const cdGeometry = new THREE.RingGeometry(1.0, 6.6, 64);
    const textureLoader = new THREE.TextureLoader();

    // --- Layer 1: The Face ---
    const faceTexture = textureLoader.load('./kieran.jpg', (texture) => {
        
    });
    
    const faceMaterial = new THREE.MeshPhysicalMaterial({
        map: faceTexture,
        side: THREE.DoubleSide,
        // transparent: true,
        // alphaTest: 0.5,
        // (You can remove all the shiny/metalness properties from this)
        // (material to make it just the face)
    });
    
    const faceMesh = new THREE.Mesh(cdGeometry, faceMaterial);
    // Add the face to the group
    cdGroup.add(faceMesh);


    // --- Layer 2: The Translucent CD Overlay ---
    // (Assumes you have 'cd_overlay.png' in your /public folder)
    const cdOverlayTexture = textureLoader.load('./cd.png', (texture) => {
        // 👇 COPY the settings from your faceTexture here 👇
        texture.repeat.set(.75, .75);
        texture.offset.set(0.126, 0.126);
    });

    const cdOverlayMaterial = new THREE.MeshPhysicalMaterial({
        map: cdOverlayTexture,      // Use the new CD texture
        side: THREE.DoubleSide,
        transparent: true,          // 👈 Make it transparent
        opacity: 0.7,               // 👈 Tweak this (0.0 to 1.0) for translucency
        
        // (You can add your shiny/metalness/iridescence properties here)
        // metalness: 0.7,
        // roughness: 0.05,
        // iridescence: 0.8,
    });

    const cdOverlayMesh = new THREE.Mesh(cdGeometry, cdOverlayMaterial);
    
    // Position it *very slightly* in front of the face
    // cdOverlayMesh.position.z = 0.01; 
    
    // Add the overlay to the group
    cdGroup.add(cdOverlayMesh);


    // --- Add the GROUP (not the meshes) to the scene ---
    scene.add(cdGroup);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2); // A soft white light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5); // A shiny directional light
    directionalLight.position.set(5, 5, 5); // Position the light
    scene.add(directionalLight);

    // --- 4. Set Initial Camera Position ---
    camera.position.z = 0.1; 
    camera.rotation.x = -0.1; 

    // --- 5. Handle Page Load Animation ---
    function startIntroAnimation() {
        // 1. Trigger the CSS scale-down
        // (This was the missing line!)
        zoomWrapper.classList.add('zoomed-out');
        train.classList.add('driving');

        // 2. Animate camera zooming out
        gsap.to(camera.position, {
            z: 10, 
            duration: 2.5,
            ease: "power2.inOut",
        });

        // 3. Animate camera straightening out
        gsap.to(camera.rotation, {
            x: 0,
            duration: 2.5,
            ease: "power2.inOut"
        });
    }
    
    // --- ⬇️ MODIFICATION HERE ⬇️ ---
    // We MUST wait a tiny bit for the page to load
    // before triggering the animation.
    setTimeout(startIntroAnimation, 100); 
    // --- ⬆️ MODIFICATION HERE ⬆️ ---

    // --- 6. The Animation Loop (Makes the CD Spin) ---
    function animate() {
        requestAnimationFrame(animate); 
        cdGroup.rotation.z += 0.005; 
        renderer.render(scene, camera);
    }
    
    animate(); 

    // --- 7. Handle Window Resizing ---
    
    function handleResize() {
        // Check if window width is mobile (<= 768px)
        const isMobile = window.innerWidth <= 768;
        
        // Use 300px for mobile, 500px for desktop
        const canvasSize = isMobile ? 300 : 500; 

        // 1. Update the camera's aspect ratio
        camera.aspect = canvasSize / canvasSize; // Still 1
        camera.updateProjectionMatrix();

        // 2. Update the renderer's size
        renderer.setSize(canvasSize, canvasSize);
    }
    
    // Call it once to set the initial size
    handleResize(); 
    
    // Add the event listener to call it on every resize
    window.addEventListener('resize', handleResize);

    
    // --- 8. All Your Window/Search Bar Logic ---
    const addressBar = document.getElementById('addressBar');
    const suggestions = document.getElementById('suggestions');
    const windowTemplate = document.getElementById('window-template');
    const closeBtn = document.getElementById('closeBtn');
    
    let maxZIndex = 10;
    let activeWindow = null;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    const navOptions = ['resume', 'projects', 'github', 'linkedin'];

    // --- Main Window Close Button (Restart animation) ---
   closeBtn.addEventListener('click', () => {
        // 1. This starts the 2.5s CSS zoom-IN animation
        zoomWrapper.classList.remove('zoomed-out');
        train.classList.remove('driving');
        
        // 2. Animate camera zooming back IN (instead of snapping)
        gsap.to(camera.position, {
            z: 0.1, // Zoom back to the start
            duration: 2.5, // Match the CSS animation time
            ease: "power2.inOut",
        });

        // 3. Animate camera rotating back to the start
        gsap.to(camera.rotation, {
            x: -0.1, // Go back to the tilted angle
            duration: 2.5,
            ease: "power2.inOut"
        });
        
        // 4. We must wait for the zoom-in to finish (2500ms)
        //    before we run the zoom-out animation again.
        setTimeout(startIntroAnimation, 2500); 
    });

    // --- Address Bar Logic (no changes) ---
    addressBar.addEventListener('input', (e) => {
        const value = e.target.value.toLowerCase();
        if (value) {
            const matches = navOptions.filter(key => key.includes(value));
            if (matches.length > 0) {
                suggestions.innerHTML = matches.map(match => 
                    `<div class="suggestion-item" data-value="${match}">${match}</div>`
                ).join('');
                suggestions.classList.add('show');
            } else {
                suggestions.classList.remove('show');
            }
        } else {
            suggestions.classList.remove('show');
        }
    });

    suggestions.addEventListener('click', (e) => {
        if (e.target.classList.contains('suggestion-item')) {
            const value = e.target.dataset.value;
            addressBar.value = value;
            suggestions.classList.remove('show');
            handleSearch(value);
            addressBar.value = '';
        }
    });

    addressBar.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            suggestions.classList.remove('show');
            handleSearch(addressBar.value);
            addressBar.value = '';
        }
    });
    
    document.addEventListener('click', (e) => {
        if (!addressBar.contains(e.target) && !suggestions.contains(e.target)) {
            suggestions.classList.remove('show');
        }
    });

    // --- Search & Window Creation (no changes) ---
    function handleSearch(query) {
        const lowerQuery = query.toLowerCase().trim();
        switch (lowerQuery) {
            case 'resume':
                createWindow({ title: 'My Resume', icon: '📄', contentUrl: './resume.html' });
                break;
            case 'projects':
                createWindow({ title: 'My Projects', icon: '💡', contentUrl: './projects.html' });
                break;
            case 'github':
                window.open('https://github.com/kierankhan', '_blank');
                break;
            case 'linkedin':
                window.open('https://linkedin.com/in/kierankhan', '_blank');
                break;
            case 'are my balls wrinkly?':
                window.open('https://wrinkle-identifier-db48a.web.app/', '_blank');
                break;
            default:
                alert('Command not found: ' + query + '\nTry: resume, projects, github, or linkedin');
        }
    }

    function createWindow(options) {
        const newWindow = windowTemplate.content.cloneNode(true).firstElementChild;
        newWindow.querySelector('.window-title').textContent = options.title;
        newWindow.querySelector('.window-icon').textContent = options.icon;
        const contentArea = newWindow.querySelector('.window-content');
        const iframe = document.createElement('iframe');
        iframe.src = options.contentUrl;
        contentArea.appendChild(iframe);
        maxZIndex++;
        newWindow.style.zIndex = maxZIndex;
        if (window.innerWidth > 768) {
            const offsetX = Math.floor(Math.random() * 100) - 50;
            const offsetY = Math.floor(Math.random() * 100) - 50;
            newWindow.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
        }
        desktop.appendChild(newWindow);
    }

    // --- Window Dragging Logic (no changes) ---
    desktop.addEventListener('mousedown', (e) => {
        const clickedWindow = e.target.closest('.draggable-window');
        if (clickedWindow) {
            maxZIndex++;
            clickedWindow.style.zIndex = maxZIndex;
        }
    });

    desktop.addEventListener('click', (e) => {
        if (e.target.classList.contains('close-btn')) {
            const windowToClose = e.target.closest('.draggable-window');
            if (windowToClose) {
                windowToClose.remove();
            }
        }
    });

    desktop.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('title-bar')) {
            activeWindow = e.target.closest('.draggable-window');
            if (!activeWindow) return;
            const rect = activeWindow.getBoundingClientRect();
            dragOffsetX = e.clientX - rect.left;
            dragOffsetY = e.clientY - rect.top;
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (activeWindow) {
            e.preventDefault();
            const parentRect = desktop.getBoundingClientRect();
            let newX = e.clientX - dragOffsetX - parentRect.left;
            let newY = e.clientY - dragOffsetY - parentRect.top;
            const windowRect = activeWindow.getBoundingClientRect();
            newX = Math.max(0, Math.min(newX, parentRect.width - windowRect.width));
            newY = Math.max(0, Math.min(newY, parentRect.height - windowRect.height));
            activeWindow.style.left = `${newX}px`;
            activeWindow.style.top = `${newY}px`;
            activeWindow.style.transform = 'none';
        }
    });

    document.addEventListener('mouseup', () => {
        activeWindow = null;
    });
});