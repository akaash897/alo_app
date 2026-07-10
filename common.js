(function () {
    'use strict';

    /* ── Configuration ─────────────────────────── */
    var CONFIG = {
        WHATSAPP_NUMBER: '',  // e.g. '91XXXXXXXXXX'
        WHATSAPP_MESSAGE: 'Hi! I\'d like to know more about ALo Candles.',
        VISIT_COUNT_KEY: 'alo_visit_count',
        COOKIE_CONSENT_KEY: 'alo_cookie_consent',
        NEWSLETTER_KEY: 'alo_newsletter',
        SCROLL_TOP_THRESHOLD: 400
    };

    /* ── Page View Counter ─────────────────────── */
    function initVisitCounter() {
        var count = (parseInt(localStorage.getItem(CONFIG.VISIT_COUNT_KEY)) || 0) + 1;
        localStorage.setItem(CONFIG.VISIT_COUNT_KEY, count);
        var el = document.getElementById('visitCount');
        if (el) { el.textContent = count; }
    }

    /* ── Mobile Menu Toggle ────────────────────── */
    function initMobileMenu() {
        var menu = document.querySelector('.mobile-menu');
        var nav = document.querySelector('nav ul');
        if (!menu || !nav) return;

        menu.addEventListener('click', function () {
            nav.classList.toggle('active');
            menu.classList.toggle('toggle');
        });

        // Close menu on link click
        nav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                nav.classList.remove('active');
                menu.classList.remove('toggle');
            });
        });
    }

    /* ── Sticky Header ─────────────────────────── */
    function initStickyHeader() {
        var header = document.querySelector('header');
        if (!header) return;

        var onScroll = function () {
            header.classList.toggle('scrolled', window.scrollY > 50);
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll(); // initial check
    }

    /* ── Smooth Scroll for Anchor Links ────────── */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (link) {
            link.addEventListener('click', function (e) {
                var targetId = link.getAttribute('href');
                if (!targetId || targetId === '#') return;
                var target = document.querySelector(targetId);
                if (!target) return;
                e.preventDefault();
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            });
        });
    }

    /* ── Scroll Reveal ─────────────────────────── */
    function initReveal() {
        var targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-children');
        if (!targets.length) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        targets.forEach(function (el) { observer.observe(el); });
    }

    /* ── Scroll To Top ─────────────────────────── */
    function initScrollTop() {
        var btn = document.createElement('button');
        btn.id = 'scrollTopBtn';
        btn.setAttribute('aria-label', 'Back to top');
        btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        document.body.appendChild(btn);

        window.addEventListener('scroll', function () {
            btn.classList.toggle('visible', window.scrollY > CONFIG.SCROLL_TOP_THRESHOLD);
        }, { passive: true });

        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ── WhatsApp Floating Button ──────────────── */
    function initWhatsApp() {
        var phone = CONFIG.WHATSAPP_NUMBER;
        if (!phone) return;

        var msg = encodeURIComponent(CONFIG.WHATSAPP_MESSAGE);
        var a = document.createElement('a');
        a.id = 'whatsappBtn';
        a.href = 'https://wa.me/' + phone + '?text=' + msg;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.setAttribute('aria-label', 'Chat on WhatsApp');
        a.innerHTML = '<i class="fab fa-whatsapp"></i><span class="wa-tooltip">Chat with us</span>';
        document.body.appendChild(a);
    }

    /* ── Cookie Consent ────────────────────────── */
    function initCookieConsent() {
        if (localStorage.getItem(CONFIG.COOKIE_CONSENT_KEY)) return;

        var banner = document.createElement('div');
        banner.id = 'cookieBanner';
        banner.innerHTML =
            '<p>We use essential cookies to improve your experience. Read our <a href="info.html#privacy">Privacy Policy</a>.</p>' +
            '<div class="cookie-actions">' +
            '  <button class="cookie-btn cookie-decline" id="cookieDecline">Decline</button>' +
            '  <button class="cookie-btn cookie-accept" id="cookieAccept">Accept</button>' +
            '</div>';
        document.body.appendChild(banner);

        setTimeout(function () { banner.classList.add('show'); }, 600);

        function dismiss(choice) {
            localStorage.setItem(CONFIG.COOKIE_CONSENT_KEY, choice);
            banner.classList.remove('show');
            setTimeout(function () { banner.remove(); }, 400);
        }

        var acceptBtn = document.getElementById('cookieAccept');
        var declineBtn = document.getElementById('cookieDecline');
        if (acceptBtn) { acceptBtn.addEventListener('click', function () { dismiss('accepted'); }); }
        if (declineBtn) { declineBtn.addEventListener('click', function () { dismiss('declined'); }); }
    }

    /* ── Newsletter Form ───────────────────────── */
    function initNewsletter() {
        var form = document.getElementById('newsletterForm');
        if (!form) return;

        var successEl = document.getElementById('newsletterSuccess');

        // If already subscribed, hide form
        if (localStorage.getItem(CONFIG.NEWSLETTER_KEY)) {
            form.style.display = 'none';
            if (successEl) { successEl.style.display = 'block'; }
            return;
        }

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var email = form.querySelector('input[type="email"]').value.trim();
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;

            form.style.display = 'none';
            if (successEl) { successEl.style.display = 'block'; }
            localStorage.setItem(CONFIG.NEWSLETTER_KEY, email);
        });
    }

    /* ── Contact Form Feedback ─────────────────── */
    function initContactForm() {
        var form = document.querySelector('.contact-form form');
        if (!form) return;

        var successDiv = document.createElement('div');
        successDiv.className = 'form-success';
        successDiv.innerHTML =
            '<div class="form-success-icon"><i class="fas fa-check"></i></div>' +
            '<h3>Message Sent!</h3>' +
            '<p>Thank you for reaching out. We\'ll get back to you within 1\u20132 business days.</p>';
        form.parentNode.insertBefore(successDiv, form.nextSibling);

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            form.style.display = 'none';
            successDiv.style.display = 'block';
        });
    }

    /* ── Active Nav Link ───────────────────────── */
    function initActiveNav() {
        var page = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('nav a').forEach(function (link) {
            var href = link.getAttribute('href');
            if (href === page || href === page + '#home') {
                link.classList.add('active');
            }
        });
    }

    /* ── Lazy Load Images ──────────────────────── */
    function initLazyImages() {
        if ('loading' in HTMLImageElement.prototype) {
            document.querySelectorAll('img:not([loading])').forEach(function (img) {
                img.setAttribute('loading', 'lazy');
            });
        }
    }

    /* ── Init All ──────────────────────────────── */
    document.addEventListener('DOMContentLoaded', function () {
        initVisitCounter();
        initMobileMenu();
        initStickyHeader();
        initSmoothScroll();
        initReveal();
        initScrollTop();
        initWhatsApp();
        initCookieConsent();
        initNewsletter();
        initContactForm();
        initActiveNav();
        initLazyImages();
    });
})();
