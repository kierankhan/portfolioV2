import * as THREE from 'three';
import { gsap } from 'gsap';

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Get Elements ---
    const canvas = document.getElementById('cd-scene');
    const zoomWrapper = document.getElementById('zoomWrapper');
    const desktop = document.getElementById('desktop');
    const train = document.getElementById('trainContainer');
    const taskbar = document.getElementById('taskbar');
    const aboutMeBtn = document.getElementById('aboutMeBtn');
    const contactBtn = document.getElementById('contactBtn');
    const formBtn = document.getElementById('formBtn');
    const suggestionsBox = document.getElementById('suggestions');
    const bookmarksBar = document.getElementById('bookmarksBar');
    const travelIcon = document.getElementById('travelIcon');
    const mysteryIcon = document.getElementById('mysteryIcon');
    const homeContent = document.getElementById('homeContent');
    const companyOverview = document.getElementById('companyOverview');
    let restingXPosition = 0;
    let restingYPosition = 0;
    let mouseX = 0;
    let mouseY = 0;

    // --- 2. Basic 3D Scene Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.001, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true
    });

    // --- 3. Create the CD ---
    const cdGroup = new THREE.Group();
    const cdGeometry = new THREE.RingGeometry(.7, 4.3, 64);
    const textureLoader = new THREE.TextureLoader();

    // --- Layer 1: The Face ---
    // ❗️ FIX: Paths in /public must start with a /
    const faceTexture = textureLoader.load('/kieran.jpg', (texture) => {
        texture.minFilter = THREE.NearestFilter;
        texture.magFilter = THREE.NearestFilter;
    });

    const faceMaterial = new THREE.MeshPhysicalMaterial({
        map: faceTexture,
        side: THREE.DoubleSide,
    });

    const faceMesh = new THREE.Mesh(cdGeometry, faceMaterial);
    cdGroup.add(faceMesh);

    // --- Layer 2: The Translucent CD Overlay ---
    // ❗️ FIX: Paths in /public must start with a /
    const cdOverlayTexture = textureLoader.load('/cd.png', (texture) => {
        texture.repeat.set(.75, .75);
        texture.offset.set(0.126, 0.126);
        texture.minFilter = THREE.NearestFilter;
        texture.magFilter = THREE.NearestFilter;
    });

    const cdOverlayMaterial = new THREE.MeshPhysicalMaterial({
        map: cdOverlayTexture,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
    });

    const cdOverlayMesh = new THREE.Mesh(cdGeometry, cdOverlayMaterial);
    cdGroup.add(cdOverlayMesh);

    // --- Add the GROUP to the scene ---
    scene.add(cdGroup);

    // Add Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);


    // --- ❗️ MOVED SECTION 7 HERE ---
    // We must run handleResize *before* setting the camera position
    function handleResize() {
        const isMobile = window.innerWidth <= 768;
        const canvasSize = isMobile ? 300 : 500;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);

        restingXPosition = isMobile ? 0 : -3.3;
        restingYPosition = isMobile ? 1.3 : -0.5;
        cdGroup.position.x = restingXPosition;
        cdGroup.position.y = restingYPosition;

        const scale = isMobile ? 0.65 : 1;
        cdGroup.scale.set(scale, scale, scale);
    }

    // This function will handle the "little spin"
    function spinCD() {
        // Adds a full 360-degree (2 * PI) rotation to the current spin
        gsap.to(cdGroup.rotation, {
            z: cdGroup.rotation.z + 6.283, // 6.283 is 2 * PI
            duration: 0.8, // 0.5 seconds
            ease: "power2.out"
        });
    }

    // This holds the HTML for each company overview.
    // I pulled this from the resume you uploaded earlier.

    const funFacts = [
        "<li>I studied abroad in Seoul, South Korea for the fall of 2025! And I did trips to Jeju Island, Taiwan, Hong Kong, and Macau. </li><img src='/sk_flag.gif' style='width: 100px; image-rendering: pixelated;' />",
        "<li>I play violin in the <a href='https://umd.gamersymphony.org/' target='_blank'>UMD Gamer Symphony Orchestra</a>. We play video game music that's been student-arranged for a full orchestra. Check us out!</li>",
        "<li><img src='/internet_connection_wiz-2.png' style='height: 50px;' /><br>I love the <a href='https://win98icons.alexmeub.com/' target='_blank'>windows 98 icons</a>.</li>",
        "<li>My favorite artist of all time is Masayoshi Takanaka. If you like jazz fusion with insane guitar, definitely give him a listen.</li><img src='/all_of_me.jpeg' style='width: 100px;' />",
        "<li>In summer 2025, I interned in Seattle. My favorite hikes were Mt. Rainier -> Lake 22 -> Lake Serene (brutal).</li><img src='/DSC07653-3.jpg' style='width: 150px;' />",
        "<li>Kung Fu Panda is my favorite animated movie.</li>",
        "<li>I like taking pictures sometimes.</li><div style='display: flex; flex-direction: row; justify-content: left; gap: 10px;'><img src='/DSC00399.jpg' style='width: 150px;' /><img src='/DSC00455-2.jpg' style='width: 150px;' /><img src='/Sunflower.jpg' style='width: 150px;' /></div>",
    ];

    const contentData = {
        "microsoft": `
            <div style="display: flex; flex-direction: row; justify-content: left; gap: 10px;">
                <h2>Microsoft</h2>
                <img src="/azure.png" style="height: 30px; image-rendering: pixelated; margin-bottom: 15px;"></img>
            </div>
            <ul>
                <li>Worked within Azure health and monitoring, one of Microsoft's largest scale services.</li>
                <li>Supported incident-response by building a failover mechanism that reduced recovery time by 95%. 🤩</li>
                <li>My feature was the main mitigation used in a major Sev1 (bad) outage across multiple datacenters. Money saved! 🤑</li>
            </ul>
        `,
        "aerospace": `
            <div style="display: flex; flex-direction: row; justify-content: left; gap: 10px;">
                <h2>Aerospace Corporation</h2>
            </div>
            <ul>
                <li>Engineered a data pipeline in Go to process heterogeneous satellite telemetry for a ground system testbed. Built a Docker-containerized telemetry system using MongoDB, MySQL, Grafana, and Kafka. This supported a re-architecturing push towards distributed reconfigurable micro-services. 🚀</li>
                <li>Determined the orbit of the satellite described in <a href="https://www.youtube.com/watch?v=bQF51mqzrY4">this</a> video. This was an open problem, and I used an internal library for orbital propagation, some orbital mechanics, as well as numerical solver techniques to do it! 🛰️</li>
            </ul>
        `,
        "usnews": `
            <div style="display: flex; flex-direction: row; justify-content: left; gap: 10px;">
                <h2>U.S. News & World Report</h2>
            </div>
            <ul>
                <li>Built a data-exploration application targetted towards non-technical staff to view, compare, visualize, and validate School ranking data.</li>
                <li>Demo'd at U.S. News headquarters to company leadership, including the CTO and lead engineers!</li>
                <img src="/surprise_emoji.jpg" style="height: 30px; image-rendering: pixelated;"></img>
            </ul>
        `,
        "mitre": `
            <div style="display: flex; flex-direction: row; justify-content: left; gap: 10px;">
                <h2>MITRE</h2>
            </div>
            <ul>
                <li>Led an 8-person team on a MITRE-sponsored project to develop a full-stack internal cyber training application.</li>
                <li>Culminated in a successful demo at MITRE HQ and approval for internal deployment.</li>
            </ul>
        `,
        "fun_facts": `
            <div style="display: flex; flex-direction: row; justify-content: left; gap: 10px;">
                <h2>(Pseudo)Random Facts About Me</h2>
            </div>
            <ul id="fun-fact-display" style="list-style-type: none; padding-left: 0; min-height: 100px; display: flex; flex-direction: column;">
                <!-- Content goes here -->
            </ul>
            <button id="reroll-btn" class="alert-ok-btn" style="margin-top: 10px; width: auto; padding: 0 10px;"><img src="/charmap_w2k-0.png" style="height: 25px; margin-right: 6px;" />Re-roll </button>
        `,
    };

    // Call it once to set the initial size AND resting positions
    handleResize();

    // Add the event listener to call it on every resize
    window.addEventListener('resize', () => {
        handleResize();
    });

    // --- 8. Handle Mouse Movement for Tilt ---
    document.addEventListener('mousemove', (event) => {
        // Normalize mouse position from -1 to 1
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = (event.clientY / window.innerHeight) * 2 - 1;
    });


    // --- 4. Set Initial Camera Position ---
    // ❗️ FIX: Set camera's initial X and Y to match the CD's position
    camera.position.x = restingXPosition;
    camera.position.y = restingYPosition;
    camera.position.z = 0.1;
    camera.rotation.x = -0.1;

    // --- 5. Handle Page Load Animation ---
    function startIntroAnimation() {
        const loadingScreen = document.getElementById('loading-screen');
        const zoomWrapper = document.getElementById('zoomWrapper');

        // 1. Reveal Main Content
        if (zoomWrapper) {
            zoomWrapper.style.transition = 'opacity 1s ease-in';
            zoomWrapper.style.opacity = '1';
        }

        // 2. Hide Loading Screen
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.remove();
            }, 2000);
        }

        // 3. Start specific animations
        canvas.style.zIndex = 2; // Set CD to resting z-index
        train.classList.add('driving');
        taskbar.classList.add('show');

        // ❗️ FIX: Animate camera X and Y to the center
        gsap.to(camera.position, {
            x: 0,
            y: 0,
            z: 10,
            duration: 2.5,
            ease: "power2.inOut",
        });

        gsap.to(camera.rotation, {
            x: 0,
            duration: 2.5,
            ease: "power2.inOut"
        });
    }


    // Wait for everything (images/styles) to load
    window.onload = () => {
        // Double check layout
        handleResize();
        // updateBookmarksVisibility();

        // Short buffer to ensure layout paints (minimum 500ms feel)
        setTimeout(startIntroAnimation, 500);
    };

    // --- Try Me Arrow Logic ---
    const tryMeArrow = document.getElementById('tryMeArrow');
    if (tryMeArrow) {
        // Wait a bit, then fade it out
        setTimeout(() => {
            tryMeArrow.classList.add('fade-out');
            // Remove from DOM after transition completes
            setTimeout(() => {
                tryMeArrow.remove();
            }, 1000); // Match CSS transition duration
        }, 20000); // Show for 20 seconds
    }

    // --- 6. The Animation Loop (Makes the CD Spin & Tilt) ---
    function animate() {
        requestAnimationFrame(animate);

        // This is your existing spin
        cdGroup.rotation.z += 0.005;

        // --- ADD TILT LOGIC ---
        // Set the intensity of the tilt (lower = more subtle)
        const tiltIntensity = 0.25;
        const targetRotationX = mouseY * tiltIntensity * -1; // Invert Y for natural up/down
        const targetRotationY = (mouseX - 100) * tiltIntensity;

        // Smoothly move to the target rotation
        const lerpFactor = 0.012; // How fast it snaps (0.01 = slow, 0.1 = fast)
        cdGroup.rotation.x += (targetRotationX - cdGroup.rotation.x) * lerpFactor;
        cdGroup.rotation.y += (targetRotationY - cdGroup.rotation.y) * lerpFactor;
        // --- END TILT LOGIC ---

        renderer.render(scene, camera);
    }

    animate();

    // --- 7. Handle Window Resizing (MOVED) ---
    // (This section is now above)

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
    closeBtn.addEventListener('click', (e) => {
        // --- 1. Close all open sub-windows ---
        const openWindows = document.querySelectorAll('.draggable-window, .alert-window, .contact-window');
        openWindows.forEach(window => window.remove());

        // const openAlerts = document.querySelectorAll('.alert-window');
        // openAlerts.forEach(window => window.remove());

        // --- 2. Run the zoom-in animation ---
        canvas.style.zIndex = 13;
        train.classList.remove('driving');
        taskbar.classList.remove('show');

        // ❗️ FIX: Animate camera X and Y back to the CD's resting position
        gsap.to(camera.position, {
            x: restingXPosition,
            y: restingYPosition,
            z: 0.1,
            duration: 2.5,
            ease: "power2.inOut",
        });

        // ❗️ FIX: Use onComplete to fix the "glitch"
        gsap.to(camera.rotation, {
            x: -0.1,
            duration: 2.5,
            ease: "power2.inOut",
            onComplete: startIntroAnimation // 👈 This calls the next animation
        });

        // ❗️ FIX: Removed the buggy setTimeout
        // setTimeout(startIntroAnimation, 2500);
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

    const searchIcon = document.getElementById('searchIcon');
    if (searchIcon) {
        searchIcon.addEventListener('click', () => {
            const value = addressBar.value;
            if (value) {
                suggestions.classList.remove('show');
                handleSearch(value);
                addressBar.value = '';
            }
        });
    }

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
                createWindow({ title: 'My Resume', icon: '📄', contentUrl: '/resume.html' });
                break;
            case 'projects':
                createWindow({ title: 'My Projects', icon: '💡', contentUrl: '/projects.html' });
                break;
            case 'inception':
                createWindow({ title: 'Inception', icon: '👁️', contentUrl: '/inception.html' });
                break;
            case 'travel':
                createWindow({ title: 'My Travels', icon: '✈️', contentUrl: '/travel.html', width: '1200px', height: '600px' });
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
            case 'flashbang':
                const flash = document.createElement('div');
                flash.className = 'flashbang-overlay';

                // 2. Add it to the main wrapper
                zoomWrapper.appendChild(flash);

                // 3. Force reflow so the transition works
                // Accessing offsetHeight triggers layout calculation
                flash.offsetHeight;

                // 4. Fade in (white screen)
                flash.style.opacity = '1';

                // 5. Play sound
                const flashSound = new Audio('/csgo-flashbang.mp3'); // or .wav
                flashSound.volume = 0.5;
                flashSound.play().catch(e => console.log('Audio error:', e));

                // 6. Fade out after a delay
                setTimeout(() => {
                    flash.style.opacity = '0';
                    // Remove from DOM after fade out is done
                    setTimeout(() => {
                        flash.remove();
                    }, 5000); // 3s fade out + buffer
                }, 100); // short delay before fading out starts (or immediate)
                break;
            case 'bangladesh jumpscare':
                const gifTemplate = document.getElementById('gif-template');
                const newGifPopup = gifTemplate.content.cloneNode(true).firstElementChild;
                const closeBtn = newGifPopup.querySelector('.alert-close-btn');

                // 1. Define the close function
                const closeGifPopup = () => newGifPopup.remove();

                // 2. Add listener to the button
                closeBtn.addEventListener('click', closeGifPopup);

                // 3. Add to the page
                zoomWrapper.appendChild(newGifPopup);

                setTimeout(closeGifPopup, 1000);

                break;
            default:
                showSimpleAlert('Address not found.\nTry: resume, projects, github, or linkedin');
        }
        addressBar.value = '';
    }

    function showSimpleAlert(message) {
        const template = document.getElementById('simple-alert-template');
        const clone = template.content.cloneNode(true).firstElementChild;

        const textEl = clone.querySelector('.alert-text');
        textEl.innerText = message; // Use innerText to preserve newlines

        const closeBtn = clone.querySelector('.alert-close-btn');
        const okBtn = clone.querySelector('.alert-ok-btn');

        const close = () => clone.remove();

        closeBtn.onclick = close;
        okBtn.onclick = close;

        zoomWrapper.appendChild(clone);
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

        // Apply custom dimensions if provided
        // Apply custom dimensions if provided
        if (options.width) {
            newWindow.style.width = options.width;
            newWindow.style.maxWidth = '100vw'; // Safeguard for mobile
        }
        if (options.height) {
            newWindow.style.height = options.height;
            newWindow.style.maxHeight = '100vh'; // Safeguard for mobile
        }

        if (window.innerWidth > 768) {
            const offsetX = Math.floor(Math.random() * 100) - 50;
            const offsetY = Math.floor(Math.random() * 100) - 50;
            newWindow.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
        }
        zoomWrapper.appendChild(newWindow);
    }

    // --- Window Dragging Logic (Attached to zoomWrapper) ---
    zoomWrapper.addEventListener('mousedown', (e) => {
        const clickedWindow = e.target.closest('.draggable-window');
        if (clickedWindow) {
            maxZIndex++;
            clickedWindow.style.zIndex = maxZIndex;
        }
    });

    zoomWrapper.addEventListener('click', (e) => {
        if (e.target.classList.contains('close-btn')) {
            const windowToClose = e.target.closest('.draggable-window');
            if (windowToClose) {
                windowToClose.remove();
            }
        }
    });

    zoomWrapper.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('title-bar')) {
            if (window.innerWidth <= 768) return; // Don't drag on mobile
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

    aboutMeBtn.addEventListener('click', () => {
        // Get the template
        const alertTemplate = document.getElementById('alert-template');
        // Clone it
        const newAlert = alertTemplate.content.cloneNode(true).firstElementChild;

        // Find the buttons inside the *new clone*
        const okBtn = newAlert.querySelector('.alert-ok-btn');
        const closeBtn = newAlert.querySelector('.alert-close-btn');

        // Function to close the alert
        const closeAlert = () => newAlert.remove();

        // Add listeners
        okBtn.addEventListener('click', closeAlert);
        closeBtn.addEventListener('click', closeAlert);

        // Add to page
        zoomWrapper.appendChild(newAlert);
    });

    contactBtn.addEventListener('click', () => {
        // Get the template
        const contactTemplate = document.getElementById('contact-template');
        // Clone it
        const newContactWindow = contactTemplate.content.cloneNode(true).firstElementChild;

        // Find the buttons inside the *new clone*
        const okBtn = newContactWindow.querySelector('.alert-ok-btn');
        const closeBtn = newContactWindow.querySelector('.alert-close-btn');

        // Function to close the alert
        const closeWindow = () => newContactWindow.remove();

        // Add listeners
        okBtn.addEventListener('click', closeWindow);
        closeBtn.addEventListener('click', closeWindow);

        // Add to page
        zoomWrapper.appendChild(newContactWindow);
    });

    formBtn.addEventListener('click', () => {
        const formTemplate = document.getElementById('form-template');
        const newFormWindow = formTemplate.content.cloneNode(true).firstElementChild;

        // --- Get Elements from the new window ---
        const closeBtn = newFormWindow.querySelector('.alert-close-btn');
        const contactForm = newFormWindow.querySelector('#contact-form');
        const submitBtn = newFormWindow.querySelector('.alert-ok-btn');

        // --- Close Button Logic ---
        const closeWindow = () => newFormWindow.remove();
        closeBtn.addEventListener('click', closeWindow);

        // --- NEW: Handle the form submission ---
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // 1. STOP the redirect

            // 2. Show user it's working
            submitBtn.textContent = "Sending...";
            submitBtn.disabled = true;

            // 3. Get the form data
            const formData = new FormData(contactForm);

            // 4. Send the data with fetch()
            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json' // 5. This tells Formspree not to redirect
                }
            })
                .then(response => {
                    if (response.ok) {
                        // 6. Success!
                        submitBtn.textContent = "Sent!";
                        setTimeout(closeWindow, 1000); // Close window after 1s
                    } else {
                        // 7. Error
                        response.json().then(data => {
                            if (Object.hasOwn(data, 'errors')) {
                                alert(data["errors"].map(error => error["message"]).join(", "));
                            } else {
                                alert("Oops! Something went wrong.");
                            }
                            submitBtn.textContent = "Send"; // Let them try again
                            submitBtn.disabled = false;
                        });
                    }
                })
                .catch(error => {
                    // 8. Network error
                    alert("Oops! A network error occurred.");
                    submitBtn.textContent = "Send";
                    submitBtn.disabled = false;
                });
        });

        zoomWrapper.appendChild(newFormWindow);
    });

    travelIcon.addEventListener('click', () => {
        createWindow({
            title: 'My Travels',
            icon: '✈️',
            contentUrl: '/travel.html',
            width: '1200px',
            height: '600px'
        });
    });

    const songIcon = document.getElementById('songIcon');
    songIcon.addEventListener('click', () => {
        const url = songIcon.getAttribute('href');
        if (url) {
            window.open(url, '_blank');
        }
    });

    mysteryIcon.addEventListener('click', () => {
        createWindow({
            title: 'Huh?',
            icon: '',
            contentUrl: '/mystery.html',
            width: '400px',
            height: '400px'
        });
    });

    bookmarksBar.addEventListener('click', (e) => {
        const clickedButton = e.target.closest('.bookmark-btn');
        if (!clickedButton) return; // Didn't click a button

        const targetID = clickedButton.dataset.target;

        // 1. Do the "little spin"
        spinCD();

        // 2. Update selected state for buttons
        bookmarksBar.querySelectorAll('.bookmark-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        clickedButton.classList.add('selected');

        // 3. Swap the content
        if (targetID === 'home') {
            homeContent.style.display = 'block';
            companyOverview.style.display = 'none';
        } else {
            // It's a company, so populate and show the overview
            homeContent.style.display = 'none';
            companyOverview.innerHTML = contentData[targetID];
            companyOverview.style.display = 'block';

            if (targetID === 'fun_facts') {
                const displayArea = document.getElementById('fun-fact-display');
                const rerollBtn = document.getElementById('reroll-btn');

                const updateFact = () => {
                    const randomIndex = Math.floor(Math.random() * funFacts.length);
                    displayArea.innerHTML = funFacts[randomIndex];
                };

                const handleReroll = () => {
                    updateFact();

                    // Disable button
                    rerollBtn.disabled = true;
                    let countdown = 5;
                    const originalText = rerollBtn.innerHTML;

                    // Initial text update
                    rerollBtn.innerText = `Wait ${countdown}s...`;

                    const timer = setInterval(() => {
                        countdown--;
                        if (countdown > 0) {
                            rerollBtn.innerText = `Wait ${countdown}s...`;
                        } else {
                            clearInterval(timer);
                            rerollBtn.disabled = false;
                            rerollBtn.innerHTML = originalText;
                        }
                    }, 1000);
                };

                // Show initial fact immediately
                updateFact();

                // Add listener
                rerollBtn.addEventListener('click', handleReroll);
            }
        }
    });
});