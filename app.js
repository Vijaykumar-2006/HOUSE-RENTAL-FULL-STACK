/* ==========================================================================
   HOMELY - PROFESSIONAL HOUSE RENTAL DASHBOARD LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize standard structure
    initNavigation();
    initMobileMenu();
    initCounterAnimations();
    
    // Initialize new Interactive Assignment-2 Modules
    initThemeSwitcher();
    initLiveClock();
    initNotificationPanel();
    initImageSlider();
    initFormHandlers();
    initScrollReveal();
    initScrollToTop();
    initTypingEffect();
    animateProgressBar();
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
   7. PROPERTY CAROUSEL / IMAGE SLIDER
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
   8. INPUT VALIDATION & REGISTRATION FORM HANDLERS
   -------------------------------------------------------------------------- */
function initFormHandlers() {
    const registerForm = document.getElementById('rental-register-form');
    const logoutBtn = document.getElementById('nav-link-logout');
    
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
    
    const genders = document.querySelectorAll('input[name="gender"]');
    genders.forEach(g => g.addEventListener('change', checkGender));

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
            
            // Add a dynamic notification to panel
            const listContainer = document.getElementById('notif-list-container');
            const badge = document.getElementById('notif-badge-count');
            
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
            
            registerForm.reset();
            
            // Clear all field highlights
            document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
            document.querySelectorAll('.error-msg').forEach(el => {
                el.textContent = '';
                el.classList.remove('visible');
            });
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

    // Mock Logout handler
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const confirmLogout = confirm('Are you sure you want to log out of the Homely Dashboard?');
            if (confirmLogout) {
                showToast('🔒 Logging out... Session expired.');
                setTimeout(() => {
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
   9. STATS COUNTER ANIMATION
   -------------------------------------------------------------------------- */
function initCounterAnimations() {
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
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
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
   12. TYPEWRITER EFFECT FOR BRAND TAGLINE
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
   13. SYSTEM PROGRESS BAR FILL ANIMATION
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
