const zoomWrapper = document.getElementById('zoomWrapper');
const closeBtn = document.getElementById('closeBtn');
const addressBar = document.getElementById('addressBar');
const suggestions = document.getElementById('suggestions');

// Navigation options
const navOptions = {
    'resume': 'https://yourwebsite.com/resume',
    'projects': 'https://yourwebsite.com/projects',
    'github': 'https://github.com/yourusername',
    'linkedin': 'https://linkedin.com/in/yourusername',
};

// Trigger zoom out on page load
setTimeout(() => {
    zoomWrapper.classList.add('zoomed-out');
}, 100);

// Close button - zoom back in and restart
closeBtn.addEventListener('click', () => {
    zoomWrapper.classList.remove('zoomed-out');
    setTimeout(() => {
        zoomWrapper.classList.add('zoomed-out');
    }, 100);
});

// Address bar autocomplete
addressBar.addEventListener('input', (e) => {
    const value = e.target.value.toLowerCase();
    if (value) {
        const matches = Object.keys(navOptions).filter(key => 
            key.includes(value)
        );
        
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

// Handle suggestion clicks
suggestions.addEventListener('click', (e) => {
    if (e.target.classList.contains('suggestion-item')) {
        const value = e.target.dataset.value;
        addressBar.value = value;
        suggestions.classList.remove('show');
        navigate(value);
    }
});

// Handle Enter key
addressBar.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        navigate(addressBar.value.toLowerCase());
    }
});

function navigate(destination) {
    if (navOptions[destination]) {
        // Zoom animation before navigation
        zoomWrapper.classList.remove('zoomed-out');
        setTimeout(() => {
            // Replace with actual navigation
            console.log('Navigating to:', navOptions[destination]);
            // window.location.href = navOptions[destination];
            alert(`Would navigate to: ${navOptions[destination]}\n\nReplace this with actual navigation in production!`);
            zoomWrapper.classList.add('zoomed-out');
        }, 2000);
    } else {
        alert('404: Page not found! Try: resume, projects, github, or linkedin');
    }
}

// Hide suggestions when clicking outside
document.addEventListener('click', (e) => {
    if (!addressBar.contains(e.target) && !suggestions.contains(e.target)) {
        suggestions.classList.remove('show');
    }
});