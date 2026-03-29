// 1. Gather our tools (Select elements from the HTML DOM)
// We find all buttons and all sections so we can manipulate them.
const navButtons = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.content-section');

// 2. Loop through every single button
navButtons.forEach(button => {
    
    // 3. Listen for a 'click' on each button
    button.addEventListener('click', function() {
        
        // Find out WHICH button was clicked by reading its data-target
        // Example: if we click Portfolio, targetId becomes 'portfolio'
        const targetId = this.getAttribute('data-target');

        // --- BUTTON STYLING ---
        // First, remove the 'active' (cyan) color from all buttons
        navButtons.forEach(btn => btn.classList.remove('active'));
        
        // Then, add the 'active' color ONLY to the button we just clicked
        this.classList.add('active');

        // --- CONTENT SWITCHING ---
        // Loop through all our sections (About, Resume, Portfolio, etc.)
        sections.forEach(section => {
            
            // If the section's ID matches the button's target, show it!
            if (section.getAttribute('id') === targetId) {
                section.style.display = 'block';
                // Trigger a CSS animation for a smooth entrance
                section.style.animation = 'fadeIn 0.5s ease forwards';
            } 
            // Otherwise, hide it.
            else {
                section.style.display = 'none';
            }
        });
    });
});

// --- MOBILE SIDEBAR TOGGLE LOGIC ---
const sidebar = document.getElementById('sidebar');
const sidebarBtn = document.getElementById('sidebar-btn');

sidebarBtn.addEventListener('click', function() {
    // .toggle() adds the 'active' class if it's missing, and removes it if it's there
    sidebar.classList.toggle('active');
});


