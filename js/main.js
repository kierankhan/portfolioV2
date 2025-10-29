// Wait for the DOM to be fully loaded before running any script
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Get All Elements ---
    // We get all our element references once at the top
    const zoomWrapper = document.getElementById('zoomWrapper');
    const closeBtn = document.getElementById('closeBtn'); // Main window's close button
    const addressBar = document.getElementById('addressBar');
    const suggestions = document.getElementById('suggestions');
    const desktop = document.querySelector('.desktop');
    const windowTemplate = document.getElementById('window-template');

    // --- 2. State Variables ---
    let maxZIndex = 10;
    let activeWindow = null;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    
    // List of commands for the autocomplete suggestions
    const navOptions = ['resume', 'projects', 'github', 'linkedin'];

    // --- 3. Initial Page Load Logic ---
    // Trigger the initial zoom-out animation
    setTimeout(() => {
        zoomWrapper.classList.add('zoomed-out');
    }, 100);

    // --- 4. Main Window Close Button ---
    // This listener is ONLY for the main "Kieran Khan" window
    closeBtn.addEventListener('click', () => {
        zoomWrapper.classList.remove('zoomed-out');
        // Restart the zoom-out (like a refresh)
        setTimeout(() => {
            zoomWrapper.classList.add('zoomed-out');
        }, 100);
    });

    // --- 5. Address Bar Autocomplete Logic ---
    // Show suggestions as the user types
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

    // --- 6. Handle Clicks on Suggestions ---
    // When a suggestion is clicked, run the search
    suggestions.addEventListener('click', (e) => {
        if (e.target.classList.contains('suggestion-item')) {
            const value = e.target.dataset.value;
            addressBar.value = value;
            suggestions.classList.remove('show');
            handleSearch(value); // <--- This now calls the NEW function
            addressBar.value = ''; // Clear the bar
        }
    });

    // --- 7. Handle 'Enter' in Address Bar ---
    // When 'Enter' is pressed, run the search
    addressBar.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Stop default form submit
            suggestions.classList.remove('show'); // Hide suggestions
            handleSearch(addressBar.value);
            addressBar.value = ''; // Clear the bar
        }
    });
    
    // --- 8. Hide suggestions when clicking outside ---
    document.addEventListener('click', (e) => {
        if (!addressBar.contains(e.target) && !suggestions.contains(e.target)) {
            suggestions.classList.remove('show');
        }
    });

    // --- 9. Core "Search" and Window-Creation ---

    /**
     * This is the main function that decides what to do
     * when the user searches for 'resume', 'projects', etc.
     */
    function handleSearch(query) {
        const lowerQuery = query.toLowerCase().trim();
        switch (lowerQuery) {
            case 'resume':
                createWindow({
                    title: 'My Resume',
                    icon: '📄',
                    contentUrl: 'resume.html' // Assumes you have a resume.html file
                });
                break;
            case 'projects':
                createWindow({
                    title: 'My Projects',
                    icon: '💡',
                    contentUrl: 'projects.html' // Assumes you have a projects.html file
                });
                break;
            case 'github':
                // For external links, just open a real new tab
                window.open('https://github.com/kierankhan', '_blank');
                break;
            case 'linkedin':
                window.open('https://linkedin.com/in/kierankhan', '_blank');
                break;
            default:
                // Feedback for an unknown command
                alert('Command not found: ' + query + '\nTry: resume, projects, github, or linkedin');
        }
    }

    /**
     * This function creates a new draggable window
     * by cloning the HTML template.
     */
    function createWindow(options) {
        // Clone the template
        const newWindow = windowTemplate.content.cloneNode(true).firstElementChild;

        // Set properties from options
        newWindow.querySelector('.window-title').textContent = options.title;
        newWindow.querySelector('.window-icon').textContent = options.icon;

        // Create an iframe to load the content (e.g., resume.html)
        const contentArea = newWindow.querySelector('.window-content');
        const iframe = document.createElement('iframe');
        iframe.src = options.contentUrl;
        contentArea.appendChild(iframe);

        // Bring to front
        maxZIndex++;
        newWindow.style.zIndex = maxZIndex;

        // Randomize starting position slightly
        const offsetX = Math.floor(Math.random() * 100) - 50;
        const offsetY = Math.floor(Math.random() * 100) - 50;
        newWindow.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;

        // Add the new window to the desktop
        desktop.appendChild(newWindow);
    }

    // --- 10. Window Interaction Logic (Drag, Close, Bring to Front) ---
    // These listeners are for the NEW draggable windows

    // --- Bring to Front ---
    // When any draggable window is clicked, bring it to the front
    desktop.addEventListener('mousedown', (e) => {
        const clickedWindow = e.target.closest('.draggable-window');
        if (clickedWindow) {
            maxZIndex++;
            clickedWindow.style.zIndex = maxZIndex;
        }
    });

    // --- Handle Close Button ---
    // This listens for clicks on any element with the class "close-btn"
    desktop.addEventListener('click', (e) => {
        if (e.target.classList.contains('close-btn')) {
            // Find the closest parent window and remove it
            const windowToClose = e.target.closest('.draggable-window');
            if (windowToClose) {
                windowToClose.remove();
            }
        }
    });

    // --- Handle Drag Start ---
    desktop.addEventListener('mousedown', (e) => {
        // Only drag by the title bar
        if (e.target.classList.contains('title-bar')) {
            activeWindow = e.target.closest('.draggable-window');
            if (!activeWindow) return; // Exit if not a draggable window

            // Calculate mouse offset from window's top-left corner
            const rect = activeWindow.getBoundingClientRect();
            dragOffsetX = e.clientX - rect.left;
            dragOffsetY = e.clientY - rect.top;
        }
    });

    // --- Handle Dragging ---
    document.addEventListener('mousemove', (e) => {
        if (activeWindow) {
            e.preventDefault(); // Prevent text selection
            const parentRect = desktop.getBoundingClientRect();

            // Calculate new position
            let newX = e.clientX - dragOffsetX - parentRect.left;
            let newY = e.clientY - dragOffsetY - parentRect.top;

            // Constrain window to desktop boundaries
            const windowRect = activeWindow.getBoundingClientRect();
            newX = Math.max(0, Math.min(newX, parentRect.width - windowRect.width));
            newY = Math.max(0, Math.min(newY, parentRect.height - windowRect.height));

            activeWindow.style.left = `${newX}px`;
            activeWindow.style.top = `${newY}px`;
            activeWindow.style.transform = 'none'; // Clear transform once dragging starts
        }
    });

    // --- Handle Drag End ---
    document.addEventListener('mouseup', () => {
        activeWindow = null; // Stop dragging
    });

}); // --- End of DOMContentLoaded ---