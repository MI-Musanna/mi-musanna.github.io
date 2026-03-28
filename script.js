function showSection(sectionId) {
    // 1. Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(sec => sec.style.display = 'none');

    // 2. Show the selected section
    document.getElementById(sectionId).style.display = 'block';

    // 3. Update active button state
    const buttons = document.querySelectorAll('.nav-link');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Find the button that was clicked and make it blue
    event.currentTarget.classList.add('active');
}