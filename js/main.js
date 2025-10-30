import * as THREE from 'three';
import { gsap } from 'gsap';

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Get Elements ---
    const canvas = document.getElementById('cd-scene');
    const zoomWrapper = document.getElementById('zoomWrapper'); 
    const desktop = document.getElementById('desktop');

    // --- 2. Basic 3D Scene Setup ---
    const scene = new THREE.Scene();
    
    // --- ⬇️ MODIFICATION HERE ⬇️ ---
    const canvasSize = 500; // Our canvas is now fixed at 500x500
    // Aspect ratio is 1 (width / height)
    const camera = new THREE.PerspectiveCamera(75, canvasSize / canvasSize, 0.1, 1000);
    // --- ⬆️ MODIFICATION HERE ⬆️ ---

    const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        alpha: true 
    });
    
    // --- ⬇️ MODIFICATION HERE ⬇️ ---
    // Set renderer to the fixed canvas size
    renderer.setSize(canvasSize, canvasSize);
    // --- ⬆️ MODIFICATION HERE ⬆️ ---

    // --- 3. Create the CD (with texture fix) ---
    const cdGeometry = new THREE.RingGeometry(1.0, 6.6, 64);
    const textureLoader = new THREE.TextureLoader();
    
    const faceTexture = textureLoader.load('kieran.jpg', (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(0.5, 0.5); 
        texture.offset.set(0.25, 0.25); 
    });
    
    const cdMaterial = new THREE.MeshBasicMaterial({ 
        map: faceTexture,
        side: THREE.DoubleSide
    });
    
    const cdMesh = new THREE.Mesh(cdGeometry, cdMaterial);
    cdMesh.rotation.x = Math.PI; 
    scene.add(cdMesh);

    // --- 4. Set Initial Camera Position ---
    camera.position.z = 0.1; 
    camera.rotation.x = -0.1; 

    // --- 5. Handle Page Load Animation ---
    function startIntroAnimation() {
        // 1. Trigger the CSS scale-down
        // (This was the missing line!)
        zoomWrapper.classList.add('zoomed-out');

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
        cdMesh.rotation.z -= 0.005; 
        renderer.render(scene, camera);
    }
    
    animate(); 

    // --- 7. Handle Window Resizing ---
    // We don't need this anymore, as the canvas is fixed!
    /*
    window.addEventListener('resize', () => {
        // ...REMOVED...
    });
    */
    
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
        // ADD THIS LINE:
        // This scales the wrapper back up
        zoomWrapper.classList.remove('zoomed-out');
        
        // Reset camera
        camera.position.z = 0.1;
        camera.rotation.x = -0.1;
        
        // We must re-run the animation
        setTimeout(startIntroAnimation, 100); 
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
                createWindow({ title: 'My Resume', icon: '📄', contentUrl: 'resume.html' });
                break;
            case 'projects':
                createWindow({ title: 'My Projects', icon: '💡', contentUrl: 'projects.html' });
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
        const offsetX = Math.floor(Math.random() * 100) - 50;
        const offsetY = Math.floor(Math.random() * 100) - 50;
        newWindow.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
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