document.addEventListener('DOMContentLoaded', () => {

    // 1. ACTIVE NAVBAR LINK ON SCROLL
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.clientHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    // 2. PORTFOLIO CATEGORY FILTERING LOGIC
    const filterItems = document.querySelectorAll('.portfolio-filters li');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    filterItems.forEach(item => {
        item.addEventListener('click', () => {
            // Active class shift
            filterItems.forEach(filter => filter.classList.remove('active'));
            item.classList.add('active');

            const selectedFilter = item.textContent.trim().toLowerCase();

            portfolioCards.forEach(card => {
                // Keep empty placeholder cards visible for grid alignment
                if (card.classList.contains('empty')) {
                    card.style.display = 'flex';
                    return;
                }

                const cardTitle = card.querySelector('h3') ? card.querySelector('h3').textContent.toLowerCase() : '';

                if (selectedFilter === 'all') {
                    card.style.display = 'flex';
                } else {
                    if (cardTitle.includes(selectedFilter) || 
                       (selectedFilter === 'ai' && cardTitle.includes('ai')) ||
                       (selectedFilter === 'web design' && (cardTitle.includes('tech arsenal') || cardTitle.includes('famexpensync'))) ||
                       (selectedFilter === 'app development' && cardTitle.includes('famexpensync'))) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });

    // 3. AUTO RESET CONTACT FORM AFTER SUBMISSION
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', () => {
            setTimeout(() => {
                contactForm.reset();
            }, 1000);
        });
    }

});
