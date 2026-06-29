/* ==========================================================================
   HOMELY — FULL-STACK RENTAL DASHBOARD (AUTH + MULTI-PAGE + RENT/BUY)
   Developer secret key: dev@homely2026
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Database & Auth initialization
    initPropertyDatabase();
    initThemeSwitcher();
    initLiveClock();
    initNotificationPanel();
    initMobileMenu();
    initScrollToTop();
    initScrollReveal();
    checkUserSession();

    // Auth pages
    initLoginPage();
    initUserRegisterPage();
    initAdminRegisterPage();
    initDeveloperPanel();

    // Main pages
    initNavigation();
    initImageSlider();
    initFormHandlers();
    initPropertyRegisterForm();
    renderPropertiesCatalog();
    renderMyProperties();

    // Stats, progress, typing
    initCounterAnimations();
    animateProgressBar();
    initTypingEffect();
});

/* --------------------------------------------------------------------------
   1. NAVIGATION
   -------------------------------------------------------------------------- */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link:not(.logout-btn):not(.login-btn)');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const t = document.querySelector(href);
                if (t) t.scrollIntoView({ behavior: 'smooth' });
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
   3. TOAST
   -------------------------------------------------------------------------- */
function showToast(message, duration = 3500) {
    const toast = document.getElementById('toast-notif');
    const toastMsg = document.getElementById('toast-message');
    if (toast && toastMsg) {
        toastMsg.textContent = message;
        toast.classList.add('show');
        toast.setAttribute('aria-hidden', 'false');
        setTimeout(() => {
            toast.classList.remove('show');
            toast.setAttribute('aria-hidden', 'true');
        }, duration);
    }
}

/* --------------------------------------------------------------------------
   4. THEME SWITCHER
   -------------------------------------------------------------------------- */
function initThemeSwitcher() {
    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (localStorage.getItem('theme') === 'light') {
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
   5. LIVE CLOCK
   -------------------------------------------------------------------------- */
function initLiveClock() {
    const timeEl = document.getElementById('live-time');
    const dateEl = document.getElementById('live-date');
    function updateClock() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12; hours = hours ? hours : 12;
        if (timeEl) timeEl.textContent = `${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
        if (dateEl) dateEl.textContent = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
    }
    updateClock();
    setInterval(updateClock, 1000);
}

/* --------------------------------------------------------------------------
   6. NOTIFICATION PANEL
   -------------------------------------------------------------------------- */
function initNotificationPanel() {
    const bellBtn = document.getElementById('notif-bell-btn');
    const panel = document.getElementById('notif-dropdown-panel');
    const listContainer = document.getElementById('notif-list-container');
    const badge = document.getElementById('notif-badge-count');
    const clearAllBtn = document.getElementById('clear-all-notifs');

    if (bellBtn && panel) {
        bellBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            panel.classList.toggle('show');
        });
        document.addEventListener('click', (e) => {
            if (!panel.contains(e.target) && !bellBtn.contains(e.target)) {
                panel.classList.remove('show');
            }
        });
    }

    function updateBadgeCount() {
        if (!listContainer || !badge) return;
        const items = listContainer.querySelectorAll('.notif-item');
        badge.textContent = items.length;
        badge.style.display = items.length === 0 ? 'none' : 'flex';
    }

    function checkEmpty() {
        if (!listContainer) return;
        if (listContainer.querySelectorAll('.notif-item').length === 0) {
            listContainer.innerHTML = '<div class="notif-empty-state">🎉 All caught up! No notifications.</div>';
        }
    }

    if (listContainer) {
        listContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('notif-dismiss')) {
                const item = e.target.closest('.notif-item');
                if (item) {
                    item.style.opacity = '0';
                    item.style.transform = 'translateX(20px)';
                    setTimeout(() => { item.remove(); updateBadgeCount(); checkEmpty(); }, 300);
                }
            }
        });
    }

    if (clearAllBtn && listContainer) {
        clearAllBtn.addEventListener('click', () => {
            listContainer.style.opacity = '0';
            setTimeout(() => {
                listContainer.innerHTML = '<div class="notif-empty-state">🎉 All caught up! No notifications.</div>';
                listContainer.style.opacity = '1';
                updateBadgeCount();
            }, 300);
            showToast('🧹 Notifications cleared.');
        });
    }
}

/* --------------------------------------------------------------------------
   7. IMAGE SLIDER (index.html)
   -------------------------------------------------------------------------- */
function initImageSlider() {
    const slider = document.getElementById('property-slider');
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const prevBtn = document.getElementById('slider-arrow-left');
    const nextBtn = document.getElementById('slider-arrow-right');
    let currentSlide = 0, slideInterval;
    if (!slider || slides.length === 0) return;

    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }
    function startAuto() { slideInterval = setInterval(() => goToSlide(currentSlide + 1), 5000); }
    function stopAuto() { clearInterval(slideInterval); }

    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); goToSlide(currentSlide - 1); });
    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); goToSlide(currentSlide + 1); });
    dots.forEach((dot, idx) => dot.addEventListener('click', (e) => { e.stopPropagation(); goToSlide(idx); }));
    slider.addEventListener('mouseenter', stopAuto);
    slider.addEventListener('mouseleave', startAuto);
    startAuto();
}

/* --------------------------------------------------------------------------
   8. FORM HANDLERS — ONBOARDING (reports.html)
   -------------------------------------------------------------------------- */
function initFormHandlers() {
    const registerForm = document.getElementById('rental-register-form');
    const logoutBtn = document.getElementById('nav-link-logout');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Are you sure you want to log out?')) {
                localStorage.removeItem('currentUser');
                showToast('🔒 Logged out.');
                setTimeout(() => { window.location.href = 'index.html'; }, 1200);
            }
        });
    }

    if (!registerForm) return;

    const nameInput = document.getElementById('reg-name');
    const emailInput = document.getElementById('reg-email');
    const phoneInput = document.getElementById('reg-phone');
    const passwordInput = document.getElementById('reg-password');
    const dobInput = document.getElementById('reg-dob');
    const addressInput = document.getElementById('reg-address');

    const nameErr = document.getElementById('err-name');
    const emailErr = document.getElementById('err-email');
    const phoneErr = document.getElementById('err-phone');
    const passwordErr = document.getElementById('err-password');
    const dobErr = document.getElementById('err-dob');
    const addressErr = document.getElementById('err-address');
    const genderErr = document.getElementById('err-gender');

    function showErr(input, errEl, msg) { input.classList.add('invalid'); errEl.textContent = msg; errEl.classList.add('visible'); return false; }
    function clearErr(input, errEl) { input.classList.remove('invalid'); errEl.textContent = ''; errEl.classList.remove('visible'); return true; }

    const checkName = () => { const v = nameInput.value.trim(); if (v.length < 3) return showErr(nameInput, nameErr, 'Min 3 characters.'); if (!/^[a-zA-Z\s]+$/.test(v)) return showErr(nameInput, nameErr, 'Letters & spaces only.'); return clearErr(nameInput, nameErr); };
    const checkEmail = () => { if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) return showErr(emailInput, emailErr, 'Invalid email.'); return clearErr(emailInput, emailErr); };
    const checkPhone = () => { if (!/^\d{10}$/.test(phoneInput.value.trim())) return showErr(phoneInput, phoneErr, 'Must be 10 digits.'); return clearErr(phoneInput, phoneErr); };
    const checkPassword = () => { const v = passwordInput.value; if (v.length < 8) return showErr(passwordInput, passwordErr, 'Min 8 characters.'); if (!(/[A-Za-z]/.test(v) && /\d/.test(v))) return showErr(passwordInput, passwordErr, 'Must have letter + number.'); return clearErr(passwordInput, passwordErr); };
    const checkDob = () => { if (!dobInput.value) return showErr(dobInput, dobErr, 'Select date of birth.'); const d = new Date(dobInput.value), t = new Date(); let age = t.getFullYear() - d.getFullYear(); const m = t.getMonth() - d.getMonth(); if (m < 0 || (m === 0 && t.getDate() < d.getDate())) age--; if (age < 18) return showErr(dobInput, dobErr, 'Must be 18+.'); return clearErr(dobInput, dobErr); };
    const checkAddress = () => { if (addressInput.value.trim().length < 15) return showErr(addressInput, addressErr, 'Min 15 characters.'); return clearErr(addressInput, addressErr); };
    const checkGender = () => { const gs = document.querySelectorAll('input[name="gender"]'); let selected = false; gs.forEach(g => { if (g.checked) selected = true; }); if (!selected) { genderErr.textContent = 'Select gender.'; genderErr.classList.add('visible'); return false; } genderErr.textContent = ''; genderErr.classList.remove('visible'); return true; };

    nameInput.addEventListener('input', checkName);
    emailInput.addEventListener('input', checkEmail);
    phoneInput.addEventListener('input', checkPhone);
    passwordInput.addEventListener('input', checkPassword);
    dobInput.addEventListener('change', checkDob);
    addressInput.addEventListener('input', checkAddress);
    document.querySelectorAll('input[name="gender"]').forEach(g => g.addEventListener('change', checkGender));

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const valid = checkName() & checkEmail() & checkPhone() & checkPassword() & checkDob() & checkAddress() & checkGender();
        if (valid) {
            const name = nameInput.value.trim();
            showToast(`🎉 Welcome to Homely, ${name}!`);
            localStorage.setItem('currentUser', JSON.stringify({ id: Date.now(), name, email: emailInput.value.trim(), role: 'user' }));
            checkUserSession();
            registerForm.reset();
            document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
            document.querySelectorAll('.error-msg').forEach(el => { el.textContent = ''; el.classList.remove('visible'); });
            setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
        } else {
            showToast('⚠️ Please fix validation errors.');
        }
    });

    registerForm.addEventListener('reset', () => {
        showToast('ℹ️ Form reset.');
        setTimeout(() => {
            document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
            document.querySelectorAll('.error-msg').forEach(el => { el.textContent = ''; el.classList.remove('visible'); });
        }, 50);
    });
}

/* --------------------------------------------------------------------------
   9. STATS COUNTER (dashboard.html)
   -------------------------------------------------------------------------- */
function initCounterAnimations() {
    const el = document.getElementById('val-total-users');
    if (!el) return;
    const counters = [
        { id: 'val-total-users', target: 12480, prefix: '' },
        { id: 'val-active-users', target: 8920, prefix: '' },
        { id: 'val-revenue', target: 142500, prefix: '$' },
        { id: 'val-transactions', target: 2345, prefix: '' }
    ];
    counters.forEach(c => {
        const e = document.getElementById(c.id);
        if (e) animateValue(e, 0, c.target, 2000, c.prefix);
    });
}

function animateValue(el, start, end, duration, prefix = '') {
    let startTs = null;
    const step = (ts) => {
        if (!startTs) startTs = ts;
        const p = Math.min((ts - startTs) / duration, 1);
        const ease = p * (2 - p);
        el.textContent = `${prefix}${Math.floor(ease * (end - start) + start).toLocaleString()}`;
        if (p < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
}

/* --------------------------------------------------------------------------
   10. SCROLL REVEAL
   -------------------------------------------------------------------------- */
function initScrollReveal() {
    const sections = document.querySelectorAll('.scroll-reveal');
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -25px 0px' });
    sections.forEach(s => observer.observe(s));
}

/* --------------------------------------------------------------------------
   11. BACK TO TOP
   -------------------------------------------------------------------------- */
function initScrollToTop() {
    const topBtn = document.getElementById('back-to-top-btn');
    if (!topBtn) return;
    window.addEventListener('scroll', () => { topBtn.classList.toggle('show', window.scrollY > 300); });
    topBtn.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
}

/* --------------------------------------------------------------------------
   12. TYPEWRITER (index.html)
   -------------------------------------------------------------------------- */
function initTypingEffect() {
    const target = document.getElementById('typing-tagline');
    if (!target) return;
    const text = "Premium House Rental Solutions";
    target.textContent = "";
    let index = 0;
    function type() { if (index < text.length) { target.textContent += text.charAt(index); index++; setTimeout(type, 100); } }
    setTimeout(type, 800);
}

/* --------------------------------------------------------------------------
   13. PROGRESS BAR (reports.html)
   -------------------------------------------------------------------------- */
function animateProgressBar() {
    const bar = document.getElementById('occupancy-progress-bar');
    const label = document.getElementById('occupancy-rate-label');
    if (!bar || !label) return;
    const target = 78; let current = 0;
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                bar.style.width = `${target}%`;
                const interval = setInterval(() => { if (current >= target) clearInterval(interval); else { current++; label.textContent = `${current}%`; } }, 25);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    observer.observe(bar);
}

/* --------------------------------------------------------------------------
   14. USER SESSION — ROLE-BASED BADGE
   -------------------------------------------------------------------------- */
function getSession() {
    try { return JSON.parse(localStorage.getItem('currentUser')); } catch { return null; }
}

function checkUserSession() {
    const session = getSession();
    const studentBadge = document.querySelector('.student-badge');
    if (!studentBadge) return;

    // Remove old session badge if exists
    const old = document.getElementById('session-badge-item');
    if (old) old.remove();

    if (session) {
        const roleClass = session.role === 'admin' ? 'role-admin' : session.role === 'developer' ? 'role-developer' : 'role-user';
        const roleLabel = session.role.charAt(0).toUpperCase() + session.role.slice(1);
        const badgeItem = document.createElement('div');
        badgeItem.className = 'badge-item';
        badgeItem.id = 'session-badge-item';
        badgeItem.innerHTML = `
            <span class="badge-label">Logged In As</span>
            <span class="badge-value" style="display:flex; align-items:center; gap:0.5rem;">
                ${session.name}
                <span class="user-role-badge ${roleClass}">${roleLabel}</span>
            </span>
        `;
        studentBadge.appendChild(badgeItem);
    }
}

/* --------------------------------------------------------------------------
   15. PROPERTY DATABASE
   -------------------------------------------------------------------------- */
const DEFAULT_PROPERTIES = [
    { id: 1, title: "The Summit Glass Villa", location: "Beverly Hills, CA", price: "$4,500/month", specs: "5 Beds, 6 Baths", image: "images/villa_exterior.png", desc: "Ultra-modern glass walls, infinity pool, and panoramic canyon vistas." },
    { id: 2, title: "Metropolitan Loft Penthouse", location: "Manhattan, NY", price: "$3,800/month", specs: "3 Beds, 3 Baths", image: "images/apartment_interior.png", desc: "Industrial brick loft with skyline terrace overlooking Manhattan." },
    { id: 3, title: "Eldorado Forest Cabin", location: "Aspen, CO", price: "$2,900/month", specs: "4 Beds, 3.5 Baths", image: "images/cabin_forest.png", desc: "Rustic wooden retreat with stone fireplace and luxury amenities." }
];

function initPropertyDatabase() {
    if (!localStorage.getItem('rent_properties')) {
        localStorage.setItem('rent_properties', JSON.stringify(DEFAULT_PROPERTIES));
    }
    if (!localStorage.getItem('rent_users')) localStorage.setItem('rent_users', JSON.stringify([]));
    if (!localStorage.getItem('rent_admin_requests')) localStorage.setItem('rent_admin_requests', JSON.stringify([]));
    if (!localStorage.getItem('rent_admins')) localStorage.setItem('rent_admins', JSON.stringify([]));
    if (!localStorage.getItem('rented_properties')) localStorage.setItem('rented_properties', JSON.stringify([]));
    if (!localStorage.getItem('purchased_properties')) localStorage.setItem('purchased_properties', JSON.stringify([]));
    if (!localStorage.getItem('dev_notifications')) localStorage.setItem('dev_notifications', JSON.stringify([]));
}

/* --------------------------------------------------------------------------
   16. PROPERTY CATALOG RENDERING (dashboard.html)
   -------------------------------------------------------------------------- */
function renderPropertiesCatalog() {
    const container = document.getElementById('properties-catalog-grid');
    if (!container) return;

    const session = getSession();
    if (!session) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem 1.5rem; background: rgba(225,29,72,0.05); border: 1px dashed rgba(225,29,72,0.3); border-radius: var(--border-radius-md);">
                <h3 style="font-family: var(--font-heading); margin-bottom: 0.5rem; color: var(--accent-danger);">🔒 Login Required</h3>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1.25rem;">You must be logged in to view rental listings.</p>
                <a href="login.html" class="btn btn-primary" style="text-decoration: none; display: inline-block;">Login Now</a>
            </div>`;
        return;
    }

    const properties = JSON.parse(localStorage.getItem('rent_properties') || '[]');
    const rented = JSON.parse(localStorage.getItem('rented_properties') || '[]');
    const purchased = JSON.parse(localStorage.getItem('purchased_properties') || '[]');

    if (properties.length === 0) {
        container.innerHTML = '<div style="grid-column:1/-1; text-align:center; color:var(--text-muted);">No properties listed yet.</div>';
        return;
    }

    container.innerHTML = properties.map(prop => {
        const isRented = rented.some(r => r.propId === prop.id && r.userId === session.id);
        const isBought = purchased.some(p => p.propId === prop.id && p.userId === session.id);

        let actionsHtml = '';
        if (isBought) {
            actionsHtml = `<div class="property-card-actions"><span class="btn-bought-tag">✅ Purchased</span></div>`;
        } else if (isRented) {
            actionsHtml = `<div class="property-card-actions"><span class="btn-rented-tag">🔑 Rented</span><button class="btn-buy" onclick="openRentBuyModal(${prop.id}, 'buy')">Buy Now</button></div>`;
        } else {
            actionsHtml = `<div class="property-card-actions"><button class="btn-rent" onclick="openRentBuyModal(${prop.id}, 'rent')">🔑 Rent</button><button class="btn-buy" onclick="openRentBuyModal(${prop.id}, 'buy')">💰 Buy</button></div>`;
        }

        return `
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
                    <span>🛏️ ${(prop.specs.split(',')[0] || '').trim()}</span>
                    <span>🛁 ${(prop.specs.split(',')[1] || '').trim()}</span>
                </div>
                <div class="property-card-footer">
                    <span class="property-card-price">${prop.price}</span>
                    <button class="property-card-btn" onclick="showToast('📞 Inquiry sent!')">Inquire</button>
                </div>
                ${actionsHtml}
            </div>
        </div>`;
    }).join('');
    initScrollReveal();
}

/* --------------------------------------------------------------------------
   17. RENT / BUY MODAL SYSTEM
   -------------------------------------------------------------------------- */
let pendingAction = null; // { propId, type: 'rent'|'buy' }

function openRentBuyModal(propId, type) {
    const properties = JSON.parse(localStorage.getItem('rent_properties') || '[]');
    const prop = properties.find(p => p.id === propId);
    if (!prop) return;

    pendingAction = { propId, type };
    const modal = document.getElementById('rent-buy-modal');
    document.getElementById('modal-icon').textContent = type === 'rent' ? '🔑' : '💰';
    document.getElementById('modal-title').textContent = type === 'rent' ? 'Confirm Rental' : 'Confirm Purchase';
    document.getElementById('modal-subtitle').textContent = type === 'rent' ? 'You are about to rent this property.' : 'You are about to purchase this property.';
    document.getElementById('modal-prop-title').textContent = prop.title;
    document.getElementById('modal-prop-location').textContent = `📍 ${prop.location}`;
    document.getElementById('modal-prop-price').textContent = prop.price;
    document.getElementById('modal-confirm-btn').textContent = type === 'rent' ? '🔑 Confirm Rental' : '💰 Confirm Purchase';
    modal.classList.add('show');
}

function closeRentBuyModal() {
    const modal = document.getElementById('rent-buy-modal');
    if (modal) modal.classList.remove('show');
    pendingAction = null;
}

function confirmRentBuy() {
    if (!pendingAction) return;
    const session = getSession();
    if (!session) { showToast('⚠️ Please login first.'); closeRentBuyModal(); return; }

    const properties = JSON.parse(localStorage.getItem('rent_properties') || '[]');
    const prop = properties.find(p => p.id === pendingAction.propId);
    if (!prop) { closeRentBuyModal(); return; }

    const record = { userId: session.id, propId: prop.id, title: prop.title, location: prop.location, price: prop.price, date: new Date().toLocaleString() };

    if (pendingAction.type === 'rent') {
        const rented = JSON.parse(localStorage.getItem('rented_properties') || '[]');
        if (rented.some(r => r.propId === prop.id && r.userId === session.id)) {
            showToast('ℹ️ You have already rented this property.'); closeRentBuyModal(); return;
        }
        rented.push(record);
        localStorage.setItem('rented_properties', JSON.stringify(rented));
        showToast(`🔑 Successfully rented "${prop.title}"!`);
    } else {
        const purchased = JSON.parse(localStorage.getItem('purchased_properties') || '[]');
        if (purchased.some(p => p.propId === prop.id && p.userId === session.id)) {
            showToast('ℹ️ You have already purchased this property.'); closeRentBuyModal(); return;
        }
        // Remove from rented if was renting
        const rented = JSON.parse(localStorage.getItem('rented_properties') || '[]');
        const filteredRented = rented.filter(r => !(r.propId === prop.id && r.userId === session.id));
        localStorage.setItem('rented_properties', JSON.stringify(filteredRented));
        purchased.push(record);
        localStorage.setItem('purchased_properties', JSON.stringify(purchased));
        showToast(`💰 Successfully purchased "${prop.title}"!`);
    }

    closeRentBuyModal();
    renderPropertiesCatalog();
    renderMyProperties();
}

/* --------------------------------------------------------------------------
   18. MY PROPERTIES SECTION (dashboard.html)
   -------------------------------------------------------------------------- */
function renderMyProperties() {
    const section = document.getElementById('my-properties-section');
    const grid = document.getElementById('user-activity-grid');
    if (!section || !grid) return;

    const session = getSession();
    if (!session) { section.style.display = 'none'; return; }

    const rented = JSON.parse(localStorage.getItem('rented_properties') || '[]').filter(r => r.userId === session.id);
    const purchased = JSON.parse(localStorage.getItem('purchased_properties') || '[]').filter(p => p.userId === session.id);

    if (rented.length === 0 && purchased.length === 0) {
        section.style.display = 'none';
        return;
    }

    section.style.display = 'block';
    let html = '';

    rented.forEach(r => {
        html += `
        <div class="activity-card">
            <div class="activity-card-icon icon-rent">🔑</div>
            <div class="activity-card-info">
                <h4>${r.title}</h4>
                <p>📍 ${r.location}</p>
                <span class="activity-price">${r.price}</span>
                <div class="activity-date">Rented: ${r.date}</div>
            </div>
        </div>`;
    });

    purchased.forEach(p => {
        html += `
        <div class="activity-card">
            <div class="activity-card-icon icon-buy">💰</div>
            <div class="activity-card-info">
                <h4>${p.title}</h4>
                <p>📍 ${p.location}</p>
                <span class="activity-price">${p.price}</span>
                <div class="activity-date">Purchased: ${p.date}</div>
            </div>
        </div>`;
    });

    grid.innerHTML = html;
}

/* --------------------------------------------------------------------------
   19. PROPERTY REGISTER FORM (register-home.html) — admin only
   -------------------------------------------------------------------------- */
function initPropertyRegisterForm() {
    const form = document.getElementById('register-home-form');
    if (!form) return;

    const session = getSession();
    if (!session || (session.role !== 'admin' && session.role !== 'developer')) {
        const wrapper = document.querySelector('.property-register-wrapper');
        if (wrapper) {
            wrapper.innerHTML = `
                <div style="text-align:center; padding:2rem 1.5rem; background:rgba(225,29,72,0.05); border:1px dashed rgba(225,29,72,0.3); border-radius:var(--border-radius-md);">
                    <h3 style="font-family:var(--font-heading); margin-bottom:0.5rem; color:var(--accent-danger);">🔒 Admin Access Only</h3>
                    <p style="font-size:0.88rem; color:var(--text-muted); margin-bottom:1.25rem;">Only approved admins can list properties. ${session ? 'Your current role is <strong>' + session.role + '</strong>.' : 'Please login first.'}</p>
                    <a href="${session ? 'dashboard.html' : 'login.html'}" class="btn btn-primary" style="text-decoration:none; display:inline-block;">${session ? 'Back to Dashboard' : 'Login Now'}</a>
                </div>`;
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

    function showE(i, e, m) { i.classList.add('invalid'); e.textContent = m; e.classList.add('visible'); return false; }
    function clearE(i, e) { i.classList.remove('invalid'); e.textContent = ''; e.classList.remove('visible'); return true; }

    const chkTitle = () => titleInput.value.trim().length < 5 ? showE(titleInput, titleErr, 'Min 5 chars.') : clearE(titleInput, titleErr);
    const chkLoc = () => locationInput.value.trim().length < 5 ? showE(locationInput, locationErr, 'Min 5 chars.') : clearE(locationInput, locationErr);
    const chkPrice = () => !/^\$?\d+(,\d+)*(\/\w+)?$/.test(priceInput.value.trim()) ? showE(priceInput, priceErr, 'e.g. $1,200 or 1500') : clearE(priceInput, priceErr);
    const chkDesc = () => descInput.value.trim().length < 20 ? showE(descInput, descErr, 'Min 20 chars.') : clearE(descInput, descErr);

    titleInput.addEventListener('input', chkTitle);
    locationInput.addEventListener('input', chkLoc);
    priceInput.addEventListener('input', chkPrice);
    descInput.addEventListener('input', chkDesc);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const valid = chkTitle() & chkLoc() & chkPrice() & chkDesc();
        if (valid) {
            let imagePath = imgSelect.value === 'apartment' ? 'images/apartment_interior.png' : imgSelect.value === 'cabin' ? 'images/cabin_forest.png' : 'images/villa_exterior.png';
            let rentPrice = priceInput.value.trim();
            if (!rentPrice.startsWith('$')) rentPrice = `$${rentPrice}`;
            if (!rentPrice.endsWith('/month')) rentPrice = `${rentPrice}/month`;

            const newProp = { id: Date.now(), title: titleInput.value.trim(), location: locationInput.value.trim(), price: rentPrice, specs: `${bedsSelect.value} Beds, ${bathsSelect.value} Baths`, image: imagePath, desc: descInput.value.trim() };
            const properties = JSON.parse(localStorage.getItem('rent_properties') || '[]');
            properties.push(newProp);
            localStorage.setItem('rent_properties', JSON.stringify(properties));
            showToast('🎉 Property listed!');
            form.reset();
            document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
            setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
        } else {
            showToast('⚠️ Fix validation errors.');
        }
    });
}

/* ==========================================================================
   AUTH SYSTEM — LOGIN, USER REGISTER, ADMIN REGISTER, DEVELOPER PANEL
   ========================================================================== */

/* --------------------------------------------------------------------------
   20. LOGIN PAGE (login.html)
   -------------------------------------------------------------------------- */
// Tab switcher (called from HTML onclick)
function switchLoginTab(tab) {
    const userTab = document.getElementById('tab-user-login');
    const adminTab = document.getElementById('tab-admin-login');
    const userForm = document.getElementById('user-login-form-container');
    const adminForm = document.getElementById('admin-login-form-container');
    if (!userTab) return;

    if (tab === 'user') {
        userTab.classList.add('active'); adminTab.classList.remove('active');
        userForm.style.display = 'block'; adminForm.style.display = 'none';
    } else {
        adminTab.classList.add('active'); userTab.classList.remove('active');
        adminForm.style.display = 'block'; userForm.style.display = 'none';
    }
}

function initLoginPage() {
    const userForm = document.getElementById('user-login-form');
    const adminForm = document.getElementById('admin-login-form');

    if (userForm) {
        userForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('user-login-email').value.trim();
            const password = document.getElementById('user-login-password').value;
            const errEmail = document.getElementById('err-user-login-email');
            const errPw = document.getElementById('err-user-login-password');

            errEmail.textContent = ''; errEmail.classList.remove('visible');
            errPw.textContent = ''; errPw.classList.remove('visible');

            if (!email) { errEmail.textContent = 'Enter your email.'; errEmail.classList.add('visible'); return; }
            if (!password) { errPw.textContent = 'Enter your password.'; errPw.classList.add('visible'); return; }

            const users = JSON.parse(localStorage.getItem('rent_users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                localStorage.setItem('currentUser', JSON.stringify({ id: user.id, name: user.name, email: user.email, role: 'user' }));
                showToast(`👋 Welcome back, ${user.name}!`);
                setTimeout(() => { window.location.href = 'dashboard.html'; }, 1200);
            } else {
                errPw.textContent = 'Invalid email or password.';
                errPw.classList.add('visible');
                showToast('❌ Login failed.');
            }
        });
    }

    if (adminForm) {
        adminForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('admin-login-email').value.trim();
            const password = document.getElementById('admin-login-password').value;
            const errEmail = document.getElementById('err-admin-login-email');
            const errPw = document.getElementById('err-admin-login-password');

            errEmail.textContent = ''; errEmail.classList.remove('visible');
            errPw.textContent = ''; errPw.classList.remove('visible');

            if (!email) { errEmail.textContent = 'Enter your email.'; errEmail.classList.add('visible'); return; }
            if (!password) { errPw.textContent = 'Enter your password.'; errPw.classList.add('visible'); return; }

            const admins = JSON.parse(localStorage.getItem('rent_admins') || '[]');
            const admin = admins.find(a => a.email === email && a.password === password);

            if (admin) {
                localStorage.setItem('currentUser', JSON.stringify({ id: admin.id, name: admin.name, email: admin.email, role: 'admin' }));
                showToast(`🛡️ Welcome, Admin ${admin.name}!`);
                setTimeout(() => { window.location.href = 'dashboard.html'; }, 1200);
            } else {
                // Check if pending
                const requests = JSON.parse(localStorage.getItem('rent_admin_requests') || '[]');
                const pending = requests.find(r => r.email === email && r.status === 'pending');
                if (pending) {
                    errPw.textContent = 'Your admin request is still pending approval.';
                    errPw.classList.add('visible');
                    showToast('⏳ Awaiting developer approval.');
                } else {
                    errPw.textContent = 'Invalid credentials or not yet approved.';
                    errPw.classList.add('visible');
                    showToast('❌ Admin login failed.');
                }
            }
        });
    }
}

/* --------------------------------------------------------------------------
   21. USER REGISTRATION (user-register.html)
   -------------------------------------------------------------------------- */
function initUserRegisterPage() {
    const form = document.getElementById('user-register-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('ureg-name').value.trim();
        const email = document.getElementById('ureg-email').value.trim();
        const phone = document.getElementById('ureg-phone').value.trim();
        const password = document.getElementById('ureg-password').value;
        const confirm = document.getElementById('ureg-confirm').value;

        const errName = document.getElementById('err-ureg-name');
        const errEmail = document.getElementById('err-ureg-email');
        const errPhone = document.getElementById('err-ureg-phone');
        const errPw = document.getElementById('err-ureg-password');
        const errConfirm = document.getElementById('err-ureg-confirm');

        // Clear all
        [errName, errEmail, errPhone, errPw, errConfirm].forEach(e => { e.textContent = ''; e.classList.remove('visible'); });

        let valid = true;
        if (name.length < 3) { errName.textContent = 'Min 3 characters.'; errName.classList.add('visible'); valid = false; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { errEmail.textContent = 'Invalid email.'; errEmail.classList.add('visible'); valid = false; }
        if (!/^\d{10}$/.test(phone)) { errPhone.textContent = 'Must be 10 digits.'; errPhone.classList.add('visible'); valid = false; }
        if (password.length < 8) { errPw.textContent = 'Min 8 characters.'; errPw.classList.add('visible'); valid = false; }
        if (password !== confirm) { errConfirm.textContent = 'Passwords do not match.'; errConfirm.classList.add('visible'); valid = false; }

        if (!valid) { showToast('⚠️ Fix validation errors.'); return; }

        // Check duplicate email
        const users = JSON.parse(localStorage.getItem('rent_users') || '[]');
        if (users.some(u => u.email === email)) {
            errEmail.textContent = 'This email is already registered.';
            errEmail.classList.add('visible');
            showToast('⚠️ Email already exists.');
            return;
        }

        const newUser = { id: Date.now(), name, email, phone, password, createdAt: new Date().toLocaleString() };
        users.push(newUser);
        localStorage.setItem('rent_users', JSON.stringify(users));
        showToast(`🎉 Account created! Redirecting to login...`);
        form.reset();
        setTimeout(() => { window.location.href = 'login.html'; }, 1500);
    });
}

/* --------------------------------------------------------------------------
   22. ADMIN REGISTRATION (admin-register.html)
   -------------------------------------------------------------------------- */
function initAdminRegisterPage() {
    const form = document.getElementById('admin-register-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('areg-name').value.trim();
        const email = document.getElementById('areg-email').value.trim();
        const org = document.getElementById('areg-org').value.trim();
        const password = document.getElementById('areg-password').value;
        const reason = document.getElementById('areg-reason').value.trim();

        const errName = document.getElementById('err-areg-name');
        const errEmail = document.getElementById('err-areg-email');
        const errOrg = document.getElementById('err-areg-org');
        const errPw = document.getElementById('err-areg-password');
        const errReason = document.getElementById('err-areg-reason');

        [errName, errEmail, errOrg, errPw, errReason].forEach(e => { e.textContent = ''; e.classList.remove('visible'); });

        let valid = true;
        if (name.length < 3) { errName.textContent = 'Min 3 characters.'; errName.classList.add('visible'); valid = false; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { errEmail.textContent = 'Invalid email.'; errEmail.classList.add('visible'); valid = false; }
        if (org.length < 3) { errOrg.textContent = 'Min 3 characters.'; errOrg.classList.add('visible'); valid = false; }
        if (password.length < 8) { errPw.textContent = 'Min 8 characters.'; errPw.classList.add('visible'); valid = false; }
        if (reason.length < 10) { errReason.textContent = 'Explain in at least 10 characters.'; errReason.classList.add('visible'); valid = false; }

        if (!valid) { showToast('⚠️ Fix validation errors.'); return; }

        // Check duplicate
        const requests = JSON.parse(localStorage.getItem('rent_admin_requests') || '[]');
        if (requests.some(r => r.email === email)) {
            errEmail.textContent = 'A request with this email already exists.';
            errEmail.classList.add('visible');
            showToast('⚠️ Duplicate request.');
            return;
        }

        const newReq = { id: Date.now(), name, email, org, password, reason, status: 'pending', createdAt: new Date().toLocaleString() };
        requests.push(newReq);
        localStorage.setItem('rent_admin_requests', JSON.stringify(requests));

        // Add developer notification
        const devNotifs = JSON.parse(localStorage.getItem('dev_notifications') || '[]');
        devNotifs.push({ id: Date.now(), adminId: newReq.id, adminName: name, email, org, reason, timestamp: new Date().toLocaleString(), read: false });
        localStorage.setItem('dev_notifications', JSON.stringify(devNotifs));

        showToast('📨 Application submitted! Awaiting developer approval.');

        const statusEl = document.getElementById('admin-request-status');
        if (statusEl) {
            statusEl.style.display = 'block';
            statusEl.style.background = 'rgba(245,158,11,0.08)';
            statusEl.style.border = '1px solid rgba(245,158,11,0.3)';
            statusEl.innerHTML = `<span class="status-pill status-pending">⏳ Pending</span><p style="margin-top:0.75rem; font-size:0.82rem; color:var(--text-muted);">Your application has been submitted. The developer will review and approve your request. You will be able to login once approved.</p>`;
        }
        form.reset();
    });
}

/* --------------------------------------------------------------------------
   23. DEVELOPER PANEL (developer.html)
   -------------------------------------------------------------------------- */
const DEV_SECRET = 'dev@homely2026';

function initDeveloperPanel() {
    const gateForm = document.getElementById('dev-gate-form');
    if (!gateForm) return;

    gateForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const pw = document.getElementById('dev-gate-password').value;
        const errEl = document.getElementById('err-dev-gate');

        if (pw === DEV_SECRET) {
            document.getElementById('dev-gate-overlay').style.display = 'none';
            document.getElementById('dev-panel-content').style.display = 'block';
            localStorage.setItem('currentUser', JSON.stringify({ id: 0, name: 'VIJAYKUMAR', email: 'dev@homely.io', role: 'developer' }));
            checkUserSession();
            showToast('🔓 Developer panel unlocked.');
            renderDevPanel();
        } else {
            errEl.textContent = 'Incorrect secret key.';
            errEl.classList.add('visible');
            showToast('❌ Access denied.');
        }
    });
}

function renderDevPanel() {
    const requests = JSON.parse(localStorage.getItem('rent_admin_requests') || '[]');
    const users = JSON.parse(localStorage.getItem('rent_users') || '[]');
    const grid = document.getElementById('admin-request-grid');
    const pending = requests.filter(r => r.status === 'pending');
    const approved = requests.filter(r => r.status === 'approved');
    const rejected = requests.filter(r => r.status === 'rejected');

    // Update stats
    const statTotal = document.getElementById('dev-stat-total');
    const statPending = document.getElementById('dev-stat-pending');
    const statApproved = document.getElementById('dev-stat-approved');
    const statRejected = document.getElementById('dev-stat-rejected');
    const badgeCount = document.getElementById('dev-pending-count');

    if (statTotal) statTotal.textContent = requests.length;
    if (statPending) statPending.textContent = pending.length;
    if (statApproved) statApproved.textContent = approved.length;
    if (statRejected) statRejected.textContent = rejected.length;
    if (badgeCount) badgeCount.textContent = `${pending.length} Pending`;

    // Render users table
    const tbody = document.getElementById('dev-users-tbody');
    if (tbody) {
        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:var(--text-muted);">No registered users yet.</td></tr>';
        } else {
            tbody.innerHTML = users.map(u => `
                <tr>
                    <td class="module-name">${u.name}</td>
                    <td>${u.email}</td>
                    <td>${u.phone || '—'}</td>
                    <td><span class="badge-status status-active">${u.createdAt || '—'}</span></td>
                </tr>
            `).join('');
        }
    }

    // Render admin request cards
    if (grid) {
        if (requests.length === 0) {
            grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; color:var(--text-muted); padding:2rem;">No admin requests received yet.</div>';
            return;
        }

        grid.innerHTML = requests.map(r => {
            let statusHtml = '';
            let cardClass = '';
            let actionsHtml = '';

            if (r.status === 'pending') {
                statusHtml = '<span class="status-pill status-pending">⏳ Pending</span>';
                actionsHtml = `
                    <div class="admin-req-actions">
                        <button class="btn-approve" onclick="approveAdmin(${r.id})">✅ Approve</button>
                        <button class="btn-reject" onclick="rejectAdmin(${r.id})">❌ Reject</button>
                    </div>`;
            } else if (r.status === 'approved') {
                statusHtml = '<span class="status-pill status-approved">✅ Approved</span>';
                cardClass = 'approved';
            } else {
                statusHtml = '<span class="status-pill status-rejected">❌ Rejected</span>';
                cardClass = 'rejected';
            }

            return `
            <div class="admin-request-card ${cardClass}">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
                    <h4 class="admin-req-name">${r.name}</h4>
                    ${statusHtml}
                </div>
                <p class="admin-req-org">🏢 ${r.org}</p>
                <p class="admin-req-email">✉️ ${r.email}</p>
                <div class="admin-req-reason"><strong>Reason:</strong> ${r.reason}</div>
                <p style="font-size:0.7rem; color:var(--text-muted); margin-bottom:0.75rem;">Applied: ${r.createdAt}</p>
                ${actionsHtml}
            </div>`;
        }).join('');
    }
}

function approveAdmin(reqId) {
    const requests = JSON.parse(localStorage.getItem('rent_admin_requests') || '[]');
    const idx = requests.findIndex(r => r.id === reqId);
    if (idx === -1) return;

    requests[idx].status = 'approved';
    localStorage.setItem('rent_admin_requests', JSON.stringify(requests));

    // Add to approved admins list
    const admins = JSON.parse(localStorage.getItem('rent_admins') || '[]');
    const req = requests[idx];
    admins.push({ id: req.id, name: req.name, email: req.email, org: req.org, password: req.password, approvedAt: new Date().toLocaleString() });
    localStorage.setItem('rent_admins', JSON.stringify(admins));

    // Mark notification as read
    const devNotifs = JSON.parse(localStorage.getItem('dev_notifications') || '[]');
    devNotifs.forEach(n => { if (n.adminId === reqId) n.read = true; });
    localStorage.setItem('dev_notifications', JSON.stringify(devNotifs));

    showToast(`✅ ${req.name} approved as admin!`);
    renderDevPanel();
}

function rejectAdmin(reqId) {
    const requests = JSON.parse(localStorage.getItem('rent_admin_requests') || '[]');
    const idx = requests.findIndex(r => r.id === reqId);
    if (idx === -1) return;

    if (!confirm(`Reject admin request from "${requests[idx].name}"?`)) return;

    requests[idx].status = 'rejected';
    localStorage.setItem('rent_admin_requests', JSON.stringify(requests));

    // Mark notification as read
    const devNotifs = JSON.parse(localStorage.getItem('dev_notifications') || '[]');
    devNotifs.forEach(n => { if (n.adminId === reqId) n.read = true; });
    localStorage.setItem('dev_notifications', JSON.stringify(devNotifs));

    showToast(`❌ ${requests[idx].name} rejected.`);
    renderDevPanel();
}
