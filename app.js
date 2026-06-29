/* ==========================================================================
   HOMELY - PROFESSIONAL HOUSE RENTAL DASHBOARD LOGIC (MULTI-PAGE VERSION)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Database initialization
    initPropertyDatabase();
    
    // Global Header & Interactive Modules (Clock, Theme, Notifications)
    initThemeSwitcher();
    initLiveClock();
    initNotificationPanel();
    initMobileMenu();
    initScrollToTop();
    initScrollReveal();
    
    // Dynamic Session Profile State
    checkUserSession();
    
    // Page-specific initializations
    initNavigation();
    initImageSlider();
    initFormHandlers();
    initPropertyRegisterForm();
    renderPropertiesCatalog();
    
    // Stats Counter & Progress Bar (Page Specific)
    initCounterAnimations();
    animateProgressBar();
    initTypingEffect();
});

/* --------------------------------------------------------------------------
   1. NAVIGATION & MULTI-PAGE ACTIVE STATE
   -------------------------------------------------------------------------- */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link:not(.logout-btn)');
    
    // Handle smooth scrolling for hash links within the same page
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // If it's a hash link on the same page
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
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
   4. LIGHT / DARK THEME SWITCHER
   -------------------------------------------------------------------------- */
function initThemeSwitcher() {
    const toggleBtn = document.getElementById('theme-toggle-btn');
    const currentTheme = localStorage.getItem('theme');
    
    // Apply saved theme on load
    if (currentTheme === 'light') {
        document.body.classList.add('light-theme');
    }
    
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const theme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
            localStorage.setItem('theme', theme);
            showToast(`🌓 Switched to ${theme === 'light' ? 'Light' : 'Dark'} Mode`);
        });
    }
}

/* --------------------------------------------------------------------------
   5. DYNAMIC DATE & TIME DISPLAY
   -------------------------------------------------------------------------- */
function initLiveClock() {
    const timeEl = document.getElementById('live-time');
    const dateEl = document.getElementById('live-date');
    
    function updateClock() {
        const now = new Date();
        
        // Time format (HH:MM:SS AM/PM)
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; 
        const formattedHours = String(hours).padStart(2, '0');
        
        if (timeEl) {
            timeEl.textContent = `${formattedHours}:${minutes}:${seconds} ${ampm}`;
        }
        
        // Date format (Day, Month Date, Year)
        const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
        if (dateEl) {
            dateEl.textContent = now.toLocaleDateString('en-US', options);
        }
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

/* --------------------------------------------------------------------------
   6. SHOW/HIDE NOTIFICATION PANEL & INTERACTION
   -------------------------------------------------------------------------- */
function initNotificationPanel() {
    const bellBtn = document.getElementById('notif-bell-btn');
    const panel = document.getElementById('notif-dropdown-panel');
    const listContainer = document.getElementById('notif-list-container');
    const badge = document.getElementById('notif-badge-count');
    const clearAllBtn = document.getElementById('clear-all-notifs');
    
    if (bellBtn && panel) {
        // Toggle notification panel show/hide
        bellBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            panel.classList.toggle('show');
            panel.setAttribute('aria-hidden', !panel.classList.contains('show'));
        });
        
        // Hide panel when clicking outside
        document.addEventListener('click', (e) => {
            if (!panel.contains(e.target) && !bellBtn.contains(e.target)) {
                panel.classList.remove('show');
                panel.setAttribute('aria-hidden', 'true');
            }
        });
    }
    
    function updateBadgeCount() {
        if (!listContainer) return;
        const activeItems = listContainer.querySelectorAll('.notif-item');
        if (badge) {
            badge.textContent = activeItems.length;
            if (activeItems.length === 0) {
                badge.style.display = 'none';
            } else {
                badge.style.display = 'flex';
            }
        }
    }
    
    function checkEmptyState() {
        if (!listContainer) return;
        const activeItems = listContainer.querySelectorAll('.notif-item');
        if (activeItems.length === 0) {
            listContainer.innerHTML = '<div class="notif-empty-state">🎉 All caught up! No notifications.</div>';
        }
    }
    
    // Dismiss single notification
    if (listContainer) {
        listContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('notif-dismiss')) {
                const item = e.target.closest('.notif-item');
                if (item) {
                    item.style.opacity = '0';
                    item.style.transform = 'translateX(20px)';
                    setTimeout(() => {
                        item.remove();
                        updateBadgeCount();
                        checkEmptyState();
                    }, 300);
                }
            }
        });
    }
    
    // Clear all notifications
    if (clearAllBtn && listContainer) {
        clearAllBtn.addEventListener('click', () => {
            listContainer.style.opacity = '0';
            setTimeout(() => {
                listContainer.innerHTML = '<div class="notif-empty-state">🎉 All caught up! No notifications.</div>';
                listContainer.style.opacity = '1';
                updateBadgeCount();
            }, 300);
            showToast('🧹 System notifications cleared.');
        });
    }
}

/* --------------------------------------------------------------------------
   7. PROPERTY CAROUSEL / IMAGE SLIDER (index.html only)
   -------------------------------------------------------------------------- */
function initImageSlider() {
    const slider = document.getElementById('property-slider');
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const prevBtn = document.getElementById('slider-arrow-left');
    const nextBtn = document.getElementById('slider-arrow-right');
    let currentSlide = 0;
    let slideInterval;
    
    if (!slider || slides.length === 0) return;
    
    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        currentSlide = (index + slides.length) % slides.length;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }
    
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }
    
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }
    
    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoSlide() {
        clearInterval(slideInterval);
    }
    
    // Arrows Event Listeners
    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prevSlide(); });
    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); nextSlide(); });
    
    // Dot Indicator clicks
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', (e) => {
            e.stopPropagation();
            goToSlide(idx);
        });
    });
    
    // Pause auto slide on hover
    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);
    
    startAutoSlide();
}

/* --------------------------------------------------------------------------
   8. INPUT VALIDATION & REGISTRATION FORM HANDLERS (reports.html only)
   -------------------------------------------------------------------------- */
function initFormHandlers() {
    const registerForm = document.getElementById('rental-register-form');
    const logoutBtn = document.getElementById('nav-link-logout');
    
    // Mock Logout handler (Global navbar action)
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const confirmLogout = confirm('Are you sure you want to log out of the Homely Dashboard?');
            if (confirmLogout) {
                localStorage.removeItem('currentUser');
                showToast('🔒 Logging out... Session expired.');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                showToast('ℹ5 Logout cancelled.');
            }
        });
    }

    if (!registerForm) return;
    
    // Inputs elements references
    const nameInput = document.getElementById('reg-name');
    const emailInput = document.getElementById('reg-email');
    const phoneInput = document.getElementById('reg-phone');
    const passwordInput = document.getElementById('reg-password');
    const dobInput = document.getElementById('reg-dob');
    const addressInput = document.getElementById('reg-address');
    
    // Error span elements references
    const nameErr = document.getElementById('err-name');
    const emailErr = document.getElementById('err-email');
    const phoneErr = document.getElementById('err-phone');
    const passwordErr = document.getElementById('err-password');
    const dobErr = document.getElementById('err-dob');
    const addressErr = document.getElementById('err-address');
    const genderErr = document.getElementById('err-gender');

    // Validation Functions
    const checkName = () => {
        const val = nameInput.value.trim();
        if (val.length < 3) {
            return showFieldError(nameInput, nameErr, 'Name must be at least 3 characters long.');
        }
        if (!/^[a-zA-Z\s]+$/.test(val)) {
            return showFieldError(nameInput, nameErr, 'Name must contain only alphabets and spaces.');
        }
        return clearFieldError(nameInput, nameErr);
    };

    const checkEmail = () => {
        const val = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val)) {
            return showFieldError(emailInput, emailErr, 'Please enter a valid email address.');
        }
        return clearFieldError(emailInput, emailErr);
    };

    const checkPhone = () => {
        const val = phoneInput.value.trim();
        if (!/^\d{10}$/.test(val)) {
            return showFieldError(phoneInput, phoneErr, 'Phone number must be exactly 10 digits.');
        }
        return clearFieldError(phoneInput, phoneErr);
    };

    const checkPassword = () => {
        const val = passwordInput.value;
        if (val.length < 8) {
            return showFieldError(passwordInput, passwordErr, 'Password must be at least 8 characters long.');
        }
        if (!(/[A-Za-z]/.test(val) && /\d/.test(val))) {
            return showFieldError(passwordInput, passwordErr, 'Password must contain at least one letter and one number.');
        }
        return clearFieldError(passwordInput, passwordErr);
    };

    const checkDob = () => {
        const val = dobInput.value;
        if (!val) {
            return showFieldError(dobInput, dobErr, 'Please select your date of birth.');
        }
        
        const dobDate = new Date(val);
        const today = new Date();
        let age = today.getFullYear() - dobDate.getFullYear();
        const m = today.getMonth() - dobDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
            age--;
        }
        
        if (age < 18) {
            return showFieldError(dobInput, dobErr, 'You must be at least 18 years old to register.');
        }
        return clearFieldError(dobInput, dobErr);
    };

    const checkAddress = () => {
        const val = addressInput.value.trim();
        if (val.length < 15) {
            return showFieldError(addressInput, addressErr, 'Please enter a detailed address (min 15 characters).');
        }
        return clearFieldError(addressInput, addressErr);
    };

    const checkGender = () => {
        const genders = document.querySelectorAll('input[name="gender"]');
        let selected = false;
        genders.forEach(g => { if (g.checked) selected = true; });
        
        if (!selected) {
            genderErr.textContent = 'Please select your gender.';
            genderErr.classList.add('visible');
            return false;
        } else {
            genderErr.textContent = '';
            genderErr.classList.remove('visible');
            return true;
        }
    };

    // Helper visibility functions
    function showFieldError(input, errorEl, msg) {
        input.classList.add('invalid');
        errorEl.textContent = msg;
        errorEl.classList.add('visible');
        return false;
    }

    function clearFieldError(input, errorEl) {
        input.classList.remove('invalid');
        errorEl.textContent = '';
        errorEl.classList.remove('visible');
        return true;
    }

    // Attach real-time input event listeners
    nameInput.addEventListener('input', checkName);
    emailInput.addEventListener('input', checkEmail);
    phoneInput.addEventListener('input', checkPhone);
    passwordInput.addEventListener('input', checkPassword);
    dobInput.addEventListener('change', checkDob);
    addressInput.addEventListener('input', checkAddress);
    
    const gendersRadio = document.querySelectorAll('input[name="gender"]');
    gendersRadio.forEach(g => g.addEventListener('change', checkGender));

    // Submit handler
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Execute all checks
        const isNameValid = checkName();
        const isEmailValid = checkEmail();
        const isPhoneValid = checkPhone();
        const isPasswordValid = checkPassword();
        const isDobValid = checkDob();
        const isAddressValid = checkAddress();
        const isGenderValid = checkGender();
        
        const isFormValid = isNameValid && isEmailValid && isPhoneValid && isPasswordValid && isDobValid && isAddressValid && isGenderValid;
        
        if (isFormValid) {
            const name = nameInput.value.trim();
            showToast(`🎉 Registration Successful! Welcome to Homely, ${name}!`);
            
            // Save user session
            localStorage.setItem('currentUser', name);
            checkUserSession();
            
            // Add a dynamic notification to panel
            const listContainer = document.getElementById('notif-list-container');
            const badge = document.getElementById('notif-badge-count');
            
            if (listContainer) {
                // Clear empty state
                const emptyState = listContainer.querySelector('.notif-empty-state');
                if (emptyState) emptyState.remove();
                
                const newId = Date.now();
                const newNotifHtml = `
                    <div class="notif-item" data-id="${newId}">
                        <span class="notif-icon success">🟢</span>
                        <div class="notif-content">
                            <p class="notif-text">User profile for tenant <strong>${name}</strong> generated and validated successfully.</p>
                            <span class="notif-time">Just now</span>
                        </div>
                        <button class="notif-dismiss" aria-label="Dismiss">×</button>
                    </div>
                `;
                listContainer.insertAdjacentHTML('afterbegin', newNotifHtml);
                
                // Pulse the notification bell
                const bell = document.getElementById('notif-bell-btn');
                if (bell) {
                    bell.classList.add('animate-pulse');
                    setTimeout(() => bell.classList.remove('animate-pulse'), 3000);
                }
                
                // Update counts
                const activeItems = listContainer.querySelectorAll('.notif-item');
                if (badge) {
                    badge.textContent = activeItems.length;
                    badge.style.display = 'flex';
                }
            }
            
            registerForm.reset();
            
            // Clear all field highlights
            document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
            document.querySelectorAll('.error-msg').forEach(el => {
                el.textContent = '';
                el.classList.remove('visible');
            });
            
            // Redirect to dashboard page
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            showToast('⚠️ Registration failed: Please resolve validation errors.');
        }
    });

    // Reset Form Listener
    registerForm.addEventListener('reset', () => {
        showToast('ℹ️ Form fields have been reset.');
        // Clear field validation states
        setTimeout(() => {
            document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
            document.querySelectorAll('.error-msg').forEach(el => {
                el.textContent = '';
                el.classList.remove('visible');
            });
        }, 50);
    });
}

/* --------------------------------------------------------------------------
   9. STATS COUNTER ANIMATION (dashboard.html only)
   -------------------------------------------------------------------------- */
function initCounterAnimations() {
    const hasCounters = document.getElementById('val-total-users');
    if (!hasCounters) return;

    const counters = [
        { id: 'val-total-users', target: 12480, prefix: '', suffix: '' },
        { id: 'val-active-users', target: 8920, prefix: '', suffix: '' },
        { id: 'val-revenue', target: 142500, prefix: '$', suffix: '' },
        { id: 'val-transactions', target: 2345, prefix: '', suffix: '' },
        { id: 'val-notifications', target: 3, prefix: '', suffix: '' },
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
        const easeProgress = progress * (2 - progress);
        const currentValue = Math.floor(easeProgress * (end - start) + start);
        const formattedValue = currentValue.toLocaleString();
        
        element.textContent = `${prefix}${formattedValue}${suffix}`;
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

/* --------------------------------------------------------------------------
   10. SCROLL REVEAL (INTERSECTION OBSERVER)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
    const sections = document.querySelectorAll('.scroll-reveal');
    
    const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -25px 0px'
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Trigger once
            }
        });
    }, options);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

/* --------------------------------------------------------------------------
   11. BACK TO TOP BUTTON
   -------------------------------------------------------------------------- */
function initScrollToTop() {
    const topBtn = document.getElementById('back-to-top-btn');
    if (!topBtn) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            topBtn.classList.add('show');
        } else {
            topBtn.classList.remove('show');
        }
    });
    
    topBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* --------------------------------------------------------------------------
   12. TYPEWRITER EFFECT FOR BRAND TAGLINE (index.html only)
   -------------------------------------------------------------------------- */
function initTypingEffect() {
    const target = document.getElementById('typing-tagline');
    if (!target) return;
    
    const text = "Premium House Rental Solutions";
    target.textContent = "";
    let index = 0;
    
    function type() {
        if (index < text.length) {
            target.textContent += text.charAt(index);
            index++;
            setTimeout(type, 100);
        }
    }
    setTimeout(type, 800);
}

/* --------------------------------------------------------------------------
   13. SYSTEM PROGRESS BAR FILL ANIMATION (reports.html only)
   -------------------------------------------------------------------------- */
function animateProgressBar() {
    const progressBar = document.getElementById('occupancy-progress-bar');
    const progressLabel = document.getElementById('occupancy-rate-label');
    
    if (progressBar && progressLabel) {
        const targetPercent = 78;
        let currentPercent = 0;
        
        const options = { threshold: 0.5 };
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    progressBar.style.width = `${targetPercent}%`;
                    const interval = setInterval(() => {
                        if (currentPercent >= targetPercent) {
                            clearInterval(interval);
                        } else {
                            currentPercent++;
                            progressLabel.textContent = `${currentPercent}%`;
                        }
                    }, 25);
                    observer.unobserve(entry.target);
                }
            });
        }, options);
        
        observer.observe(progressBar);
    }
}

/* --------------------------------------------------------------------------
   14. DYNAMIC ACTIVE USER PROFILE BADGE SYSTEM
   -------------------------------------------------------------------------- */
function checkUserSession() {
    const currentUser = localStorage.getItem('currentUser');
    const studentBadge = document.querySelector('.student-badge');
    
    if (currentUser && studentBadge) {
        const existingBadge = document.getElementById('session-badge-item');
        if (existingBadge) existingBadge.remove();
        
        const badgeItem = document.createElement('div');
        badgeItem.className = 'badge-item';
        badgeItem.id = 'session-badge-item';
        badgeItem.innerHTML = `
            <span class="badge-label">Active User</span>
            <span class="badge-value" style="color: var(--accent-success);">${currentUser}</span>
        `;
        studentBadge.appendChild(badgeItem);
    }
}

/* --------------------------------------------------------------------------
   15. PROPERTIES STORAGE DATABASE & RENDERING (dashboard.html & register-home.html)
   -------------------------------------------------------------------------- */
const DEFAULT_PROPERTIES = [
    {
        id: 1,
        title: "The Summit Glass Villa",
        location: "Beverly Hills, CA",
        price: "$4,500/month",
        specs: "5 Beds, 6 Baths",
        image: "images/villa_exterior.png",
        desc: "An ultra-modern architectural masterpiece featuring floor-to-ceiling glass walls, an infinity edge pool, and panoramic canyon vistas."
    },
    {
        id: 2,
        title: "Metropolitan Loft Penthouse",
        location: "Manhattan, NY",
        price: "$3,800/month",
        specs: "3 Beds, 3 Baths",
        image: "images/apartment_interior.png",
        desc: "Cozy urban loft style with industrial brick exposures, custom premium furniture, and a private skyline terrace overlooking Manhattan."
    },
    {
        id: 3,
        title: "Eldorado Forest Cabin",
        location: "Aspen, CO",
        price: "$2,900/month",
        specs: "4 Beds, 3.5 Baths",
        image: "images/cabin_forest.png",
        desc: "A charming rustic wooden retreat nestled in dense pine woods, equipped with stone fireplace layouts and luxury modern amenities."
    }
];

function initPropertyDatabase() {
    if (!localStorage.getItem('rent_properties')) {
        localStorage.setItem('rent_properties', JSON.stringify(DEFAULT_PROPERTIES));
    }
}

function renderPropertiesCatalog() {
    const container = document.getElementById('properties-catalog-grid');
    if (!container) return;
    
    // Check if the user is registered/logged in to view listings
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem 1.5rem; background: rgba(225, 29, 72, 0.05); border: 1px dashed rgba(225, 29, 72, 0.3); border-radius: var(--border-radius-md);">
                <h3 style="font-family: var(--font-heading); margin-bottom: 0.5rem; color: var(--accent-danger);">🔒 Renter Verification Required</h3>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1.25rem;">Rental properties are only visible to registered community users. Please complete onboarding registration.</p>
                <a href="reports.html" class="btn btn-primary" style="text-decoration: none; display: inline-block;">Onboard Now</a>
            </div>
        `;
        return;
    }
    
    const properties = JSON.parse(localStorage.getItem('rent_properties') || '[]');
    
    if (properties.length === 0) {
        container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No rental properties listed yet.</div>';
        return;
    }
    
    container.innerHTML = properties.map(prop => `
        <div class="property-catalog-card scroll-reveal">
            <div class="property-card-img-wrapper">
                <img src="${prop.image}" alt="${prop.title}" class="property-card-img">
                <span class="property-card-badge">For Rent</span>
            </div>
            <div class="property-card-content">
                <h4 class="property-card-title">${prop.title}</h4>
                <span class="property-card-location">📍 ${prop.location}</span>
                <p class="property-card-desc">${prop.desc}</p>
                <div class="property-card-specs">
                    <span>🛏️ ${prop.specs.split(',')[0] || ''}</span>
                    <span>🛁 ${prop.specs.split(',')[1] || ''}</span>
                </div>
                <div class="property-card-footer">
                    <span class="property-card-price">${prop.price}</span>
                    <button class="property-card-btn" onclick="showToast('📞 Inquiry sent! Listing agent will contact you shortly.')">Inquire Now</button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Trigger scroll reveal observer for new elements
    initScrollReveal();
}

function initPropertyRegisterForm() {
    const form = document.getElementById('register-home-form');
    if (!form) return;
    
    // Check if the user is registered/logged in to register properties
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        const cardWrapper = document.querySelector('.property-register-wrapper');
        if (cardWrapper) {
            cardWrapper.innerHTML = `
                <div style="text-align: center; padding: 2rem 1.5rem; background: rgba(225, 29, 72, 0.05); border: 1px dashed rgba(225, 29, 72, 0.3); border-radius: var(--border-radius-md);">
                    <h3 style="font-family: var(--font-heading); margin-bottom: 0.5rem; color: var(--accent-danger);">🔒 Landlord Verification Required</h3>
                    <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1.25rem;">You must be a registered member to list your home for rent on Homely. Please register first.</p>
                    <a href="reports.html" class="btn btn-primary" style="text-decoration: none; display: inline-block;">Onboard Now</a>
                </div>
            `;
        }
        return;
    }
    
    const titleInput = document.getElementById('prop-title');
    const locationInput = document.getElementById('prop-location');
    const priceInput = document.getElementById('prop-price');
    const bedsSelect = document.getElementById('prop-beds');
    const bathsSelect = document.getElementById('prop-baths');
    const imgSelect = document.getElementById('prop-image');
    const descInput = document.getElementById('prop-desc');
    
    const titleErr = document.getElementById('err-prop-title');
    const locationErr = document.getElementById('err-prop-location');
    const priceErr = document.getElementById('err-prop-price');
    const descErr = document.getElementById('err-prop-desc');
    
    const checkTitle = () => {
        const val = titleInput.value.trim();
        if (val.length < 5) {
            titleInput.classList.add('invalid');
            titleErr.textContent = 'Property title must be at least 5 characters.';
            titleErr.classList.add('visible');
            return false;
        }
        titleInput.classList.remove('invalid');
        titleErr.textContent = '';
        titleErr.classList.remove('visible');
        return true;
    };
    
    const checkLocation = () => {
        const val = locationInput.value.trim();
        if (val.length < 5) {
            locationInput.classList.add('invalid');
            locationErr.textContent = 'Location must be at least 5 characters.';
            locationErr.classList.add('visible');
            return false;
        }
        locationInput.classList.remove('invalid');
        locationErr.textContent = '';
        locationErr.classList.remove('visible');
        return true;
    };
    
    const checkPrice = () => {
        const val = priceInput.value.trim();
        // Regex checking valid number formatting, e.g. "$1,500" or "1500" or "$1,200/month"
        if (!/^\$?\d+(,\d+)*(\/\w+)?$/.test(val)) {
            priceInput.classList.add('invalid');
            priceErr.textContent = 'Please enter a valid price (e.g. $1,200 or 1500).';
            priceErr.classList.add('visible');
            return false;
        }
        priceInput.classList.remove('invalid');
        priceErr.textContent = '';
        priceErr.classList.remove('visible');
        return true;
    };
    
    const checkDesc = () => {
        const val = descInput.value.trim();
        if (val.length < 20) {
            descInput.classList.add('invalid');
            descErr.textContent = 'Please enter a detailed description of at least 20 characters.';
            descErr.classList.add('visible');
            return false;
        }
        descInput.classList.remove('invalid');
        descErr.textContent = '';
        descErr.classList.remove('visible');
        return true;
    };
    
    titleInput.addEventListener('input', checkTitle);
    locationInput.addEventListener('input', checkLocation);
    priceInput.addEventListener('input', checkPrice);
    descInput.addEventListener('input', checkDesc);
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const isTitleValid = checkTitle();
        const isLocationValid = checkLocation();
        const isPriceValid = checkPrice();
        const isDescValid = checkDesc();
        
        if (isTitleValid && isLocationValid && isPriceValid && isDescValid) {
            // Determine image path from select value
            let imagePath = "images/villa_exterior.png";
            if (imgSelect.value === 'apartment') {
                imagePath = "images/apartment_interior.png";
            } else if (imgSelect.value === 'cabin') {
                imagePath = "images/cabin_forest.png";
            }
            
            // Clean price input format
            let rentPrice = priceInput.value.trim();
            if (!rentPrice.startsWith('$')) {
                rentPrice = `$${rentPrice}`;
            }
            if (!rentPrice.endsWith('/month')) {
                rentPrice = `${rentPrice}/month`;
            }
            
            const newProperty = {
                id: Date.now(),
                title: titleInput.value.trim(),
                location: locationInput.value.trim(),
                price: rentPrice,
                specs: `${bedsSelect.value} Beds, ${bathsSelect.value} Baths`,
                image: imagePath,
                desc: descInput.value.trim()
            };
            
            // Save to localStorage list
            const properties = JSON.parse(localStorage.getItem('rent_properties') || '[]');
            properties.push(newProperty);
            localStorage.setItem('rent_properties', JSON.stringify(properties));
            
            // Inject notification item
            const listContainer = document.getElementById('notif-list-container');
            const badge = document.getElementById('notif-badge-count');
            
            if (listContainer) {
                const empty = listContainer.querySelector('.notif-empty-state');
                if (empty) empty.remove();
                
                const newNotifHtml = `
                    <div class="notif-item" data-id="${newProperty.id}">
                        <span class="notif-icon success">🟢</span>
                        <div class="notif-content">
                            <p class="notif-text">New home listing <strong>${newProperty.title}</strong> registered successfully by landlord.</p>
                            <span class="notif-time">Just now</span>
                        </div>
                        <button class="notif-dismiss" aria-label="Dismiss">×</button>
                    </div>
                `;
                listContainer.insertAdjacentHTML('afterbegin', newNotifHtml);
                
                const activeItems = listContainer.querySelectorAll('.notif-item');
                if (badge) {
                    badge.textContent = activeItems.length;
                    badge.style.display = 'flex';
                }
            }
            
            showToast('🎉 Home registered successfully!');
            form.reset();
            
            // Clear styles
            document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
            
            // Redirect to dashboard page after short pause
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            showToast('⚠️ Listing failed: Please check validation errors.');
        }
    });
}
