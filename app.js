/* ==========================================================================
   HOMELY - PROFESSIONAL HOUSE RENTAL DASHBOARD LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules and dynamic components
    initNavigation();
    initMobileMenu();
    initFormHandlers();
    initCounterAnimations();
});

/* --------------------------------------------------------------------------
   1. NAVIGATION & SCROLL TRACKING
   -------------------------------------------------------------------------- */
function initNavigation() {
    const sections = document.querySelectorAll('section.content-section');
    const navLinks = document.querySelectorAll('.nav-link:not(.logout-btn)');
    
    // Smooth navigation clicking
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Scroll smoothly to section
                targetSection.scrollIntoView({ behavior: 'smooth' });
                
                // Set active class
                navLinks.forEach(item => item.classList.remove('active'));
                link.classList.add('active');
                
                // If mobile nav is open, close it
                const navList = document.getElementById('nav-links');
                if (navList.classList.contains('active')) {
                    navList.classList.remove('active');
                }
            }
        });
    });

    // Active state highlighting on scroll
    window.addEventListener('scroll', () => {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Highlight when section is 30% down the screen viewport
            if (window.scrollY >= (sectionTop - window.innerHeight * 0.3)) {
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
}

/* --------------------------------------------------------------------------
   2. MOBILE NAV TOGGLE
   -------------------------------------------------------------------------- */
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navLinksList = document.getElementById('nav-links');
    
    if (menuToggle && navLinksList) {
        menuToggle.addEventListener('click', () => {
            navLinksList.classList.toggle('active');
            menuToggle.classList.toggle('open');
        });
    }
}

/* --------------------------------------------------------------------------
   3. TOAST NOTIFICATIONS
   -------------------------------------------------------------------------- */
function showToast(message, duration = 3500) {
    const toast = document.getElementById('toast-notif');
    const toastMsg = document.getElementById('toast-message');
    
    if (toast && toastMsg) {
        toastMsg.textContent = message;
        toast.classList.add('show');
        toast.setAttribute('aria-hidden', 'false');
        
        // Auto-hide after specified duration
        setTimeout(() => {
            toast.classList.remove('show');
            toast.setAttribute('aria-hidden', 'true');
        }, duration);
    }
}

/* --------------------------------------------------------------------------
   4. FORM VALIDATION & SUBMISSION INTERCEPTORS
   -------------------------------------------------------------------------- */
function initFormHandlers() {
    const registerForm = document.getElementById('rental-register-form');
    const logoutBtn = document.getElementById('nav-link-logout');
    
    // Register Form Handler
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get values
            const name = document.getElementById('reg-name').value.trim();
            const email = document.getElementById('reg-email').value.trim();
            const phone = document.getElementById('reg-phone').value.trim();
            const dob = document.getElementById('reg-dob').value;
            
            // Basic format validation checks
            if (name.length < 3) {
                showToast('❌ Registration failed: Please enter a valid name.');
                return;
            }
            
            if (phone.length !== 10 || isNaN(phone)) {
                showToast('❌ Registration failed: Phone number must be exactly 10 digits.');
                return;
            }

            // Calculate age to ensure user is of legal age (18+)
            const dobDate = new Date(dob);
            const today = new Date();
            let age = today.getFullYear() - dobDate.getFullYear();
            const m = today.getMonth() - dobDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
                age--;
            }
            
            if (age < 18) {
                showToast('⚠️ Alert: Registration failed. You must be 18 years or older.');
                return;
            }

            // Mock Successful Registration
            showToast(`🎉 Registration Successful! Welcome to Homely, ${name}!`);
            
            // Reset the form input elements
            registerForm.reset();
        });

        // Form Reset Handler
        registerForm.addEventListener('reset', () => {
            showToast('ℹ️ Form fields have been reset.');
        });
    }

    // Mock Logout handler
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const confirmLogout = confirm('Are you sure you want to log out of the Homely Dashboard?');
            
            if (confirmLogout) {
                showToast('🔒 Logging out... Session expired.');
                setTimeout(() => {
                    // Redirect to welcome section and reload simulated state
                    window.location.hash = '#home';
                    window.location.reload();
                }, 1500);
            } else {
                showToast('ℹ️ Logout cancelled.');
            }
        });
    }
}

/* --------------------------------------------------------------------------
   5. STATS COUNTER ANIMATION
   -------------------------------------------------------------------------- */
function initCounterAnimations() {
    // Configuration details for count up animations
    const counters = [
        { id: 'val-total-users', target: 12480, prefix: '', suffix: '' },
        { id: 'val-active-users', target: 8920, prefix: '', suffix: '' },
        { id: 'val-revenue', target: 142500, prefix: '$', suffix: '' },
        { id: 'val-transactions', target: 2345, prefix: '', suffix: '' },
        { id: 'val-notifications', target: 24, prefix: '', suffix: '' },
        { id: 'val-pending-tasks', target: 14, prefix: '', suffix: '' }
    ];

    counters.forEach(counter => {
        const el = document.getElementById(counter.id);
        if (el) {
            animateValue(el, 0, counter.target, 2000, counter.prefix, counter.suffix);
        }
    });
}

function animateValue(element, start, end, duration, prefix = '', suffix = '') {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // Calculate current value using easeOutQuad for a smooth decelerating animation
        const easeProgress = progress * (2 - progress);
        const currentValue = Math.floor(easeProgress * (end - start) + start);
        
        // Format with commas if number is large
        const formattedValue = currentValue.toLocaleString();
        
        element.textContent = `${prefix}${formattedValue}${suffix}`;
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}
