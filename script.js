/**
 * ==========================================================================
 * MAHDI ISLAM | PROFESSIONAL PORTFOLIO
 * Architecture: Modular ES6+ Client Engine
 * Features:
 *   - IntersectionObserver Active ScrollSpy (Desktop Nav & Mobile Dock)
 *   - Dynamic Project Category Filtering with Fade Animation
 *   - Asynchronous Formspree AJAX Submission with Toast Notifications
 *   - Copy Coordinates to Clipboard
 *   - Mobile Menu Drawer & Micro-interactions
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // --- 1. TOAST NOTIFICATION UTILITY ---
    const toastContainer = document.getElementById('toastContainer');

    /**
     * Display a sleek glassmorphic toast notification.
     * @param {string} message - Message text to display
     * @param {'mint' | 'amber'} type - Accent glow theme
     * @param {number} duration - Auto dismiss timeout in ms
     */
    function showToast(message, type = 'mint', duration = 4000) {
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        const iconName = type === 'mint' ? 'checkmark-circle-outline' : 'alert-circle-outline';
        toast.innerHTML = `
            <ion-icon name="${iconName}"></ion-icon>
            <span>${message}</span>
        `;

        toastContainer.appendChild(toast);

        // Auto removal after duration
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(15px) scale(0.95)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
    }

    // --- 2. ACTIVE SCROLLSPY (DESKTOP & MOBILE DOCK) ---
    const navLinks = document.querySelectorAll('.nav-link');
    const dockItems = document.querySelectorAll('.dock-item');
    const sections = document.querySelectorAll('section[id], header[id]');

    function updateActiveNavigation() {
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Update Desktop Navbar
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === `#${sectionId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });

                // Update Mobile Floating Dock
                dockItems.forEach(dock => {
                    const target = dock.getAttribute('data-target');
                    if (target === sectionId) {
                        dock.classList.add('active');
                    } else {
                        dock.classList.remove('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavigation, { passive: true });
    updateActiveNavigation(); // Initial check

    // --- 3. MOBILE MENU TOGGLE ---
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinksWrapper = document.getElementById('navLinksWrapper');

    if (mobileToggle && navLinksWrapper) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navLinksWrapper.classList.toggle('open');
        });

        // Close mobile drawer when any link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navLinksWrapper.classList.remove('open');
            });
        });
    }

    // --- 4. PROJECT CATEGORY FILTERING ---
    const filterButtons = document.querySelectorAll('#portfolioFilters .filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterButtons.length > 0 && projectCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Set active filter button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const selectedCategory = button.getAttribute('data-filter') || 'all';

                // Filter cards with smooth fade transitions
                projectCards.forEach(card => {
                    const categories = (card.getAttribute('data-category') || '').toLowerCase().split(/\s+/);
                    const shouldDisplay = (selectedCategory === 'all') || categories.includes(selectedCategory);

                    if (shouldDisplay) {
                        card.style.display = 'flex';
                        // Trigger reflow to restart CSS animation
                        void card.offsetWidth;
                        card.classList.remove('fade-out');
                        card.classList.add('fade-in');
                    } else {
                        card.classList.remove('fade-in');
                        card.classList.add('fade-out');
                        setTimeout(() => {
                            if (card.classList.contains('fade-out')) {
                                card.style.display = 'none';
                            }
                        }, 250);
                    }
                });
            });

            // Keyboard accessibility for filter tabs
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    button.click();
                }
            });
        });
    }

    // --- 5. ASYNCHRONOUS FORMSPREE SUBMISSION (AJAX) ---
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formFeedback = document.getElementById('formFeedback');

    if (contactForm && submitBtn) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Clear previous feedback
            if (formFeedback) {
                formFeedback.className = 'form-feedback';
                formFeedback.style.display = 'none';
                formFeedback.textContent = '';
            }

            // Set loading state
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Success state
                    contactForm.reset();
                    if (formFeedback) {
                        formFeedback.className = 'form-feedback success';
                        formFeedback.textContent = 'Transmission received successfully! Mahdi will respond to your inquiry shortly.';
                        formFeedback.style.display = 'block';
                    }
                    showToast('Transmission transmitted successfully! Thank you.', 'mint');
                } else {
                    // Server responded with non-200
                    const data = await response.json().catch(() => null);
                    let errorMessage = 'Oops! There was an issue submitting your transmission. Please email directly.';
                    if (data && data.errors && data.errors.length > 0) {
                        errorMessage = data.errors.map(err => err.message).join(', ');
                    }
                    if (formFeedback) {
                        formFeedback.className = 'form-feedback error';
                        formFeedback.textContent = errorMessage;
                        formFeedback.style.display = 'block';
                    }
                    showToast('Transmission failed. Direct email available.', 'amber');
                }
            } catch (networkError) {
                // Network error
                if (formFeedback) {
                    formFeedback.className = 'form-feedback error';
                    formFeedback.textContent = 'Network communication failure. Please check your connection or email directly to hello.musanna@proton.me.';
                    formFeedback.style.display = 'block';
                }
                showToast('Network error while transmitting.', 'amber');
            } finally {
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
            }
        });
    }

    // --- 6. COPY EMAIL COORDINATES TO CLIPBOARD ---
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    const emailCoord = document.getElementById('emailCoord');

    if (copyEmailBtn && emailCoord) {
        copyEmailBtn.addEventListener('click', async () => {
            const emailAddress = emailCoord.textContent.trim();
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(emailAddress);
                } else {
                    // Fallback for non-secure contexts
                    const tempInput = document.createElement('input');
                    tempInput.value = emailAddress;
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempInput);
                }
                showToast('Email copied to clipboard: ' + emailAddress, 'mint');
            } catch (err) {
                showToast('Unable to copy. Email: ' + emailAddress, 'amber');
            }
        });
    }

    // --- 7. BACK TO TOP BUTTON ---
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- 8. SUBTLE INTERACTIVE TILT FOR BENTO & CARDS ---
    const glassCards = document.querySelectorAll('.bento-card, .project-card');
    glassCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    console.log(
        '%c MI. Portfolio %c Cyber Emerald & Obsidian Glass Initialized ',
        'background: #10b981; color: #070a0f; font-weight: bold; border-radius: 4px; padding: 2px 6px;',
        'background: #0d121c; color: #34d399; border: 1px solid #10b981; border-radius: 4px; padding: 2px 6px;'
    );
});