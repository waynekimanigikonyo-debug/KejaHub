document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Mobile Menu Toggle ---
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Toggle visibility of the navigation links
            mobileMenu.classList.toggle('hidden');
        });
    }

    // --- 2. Contact Form Handling ---
    const contactForm = document.getElementById('ContactUs');
    const formFeedback = document.getElementById('form-feedback');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevents page reload

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;

            // Simple validation feedback
            if (formFeedback) {
                formFeedback.textContent = `Thank you, ${name}! We will reach out to you at ${email} shortly.`;
                formFeedback.className = "mt-4 p-3 bg-green-100 text-green-800 rounded-md font-semibold text-center";
                formFeedback.classList.remove('hidden');
            }

            // Clear the form fields
            contactForm.reset();
        });
    }

    // --- 3. CTA Button Interactions ---
    const exploreBtn = document.getElementById('explore-btn');
    const getStartedBtn = document.getElementById('get-started-btn');

    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    }
});