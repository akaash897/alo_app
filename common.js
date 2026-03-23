/* =============================================
   common.js — shared behaviour across all ALo pages
   ============================================= */
(function () {
    'use strict';

    /* ── Scroll Reveal ─────────────────────────── */
    function initReveal() {
        const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-children');
        if (!targets.length) return;

        const observer = new IntersectionObserver(function (entries) {
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
            btn.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });

        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ── WhatsApp Floating Button ──────────────── */
    function initWhatsApp() {
        var phone = ''; // add WhatsApp number here e.g. '91XXXXXXXXXX'
        if (!phone) return;
        var message = encodeURIComponent('Hi! I\'d like to know more about ALo Candles.');
        var a = document.createElement('a');
        a.id = 'whatsappBtn';
        a.href = 'https://wa.me/' + phone + '?text=' + message;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.setAttribute('aria-label', 'Chat on WhatsApp');
        a.innerHTML = '<i class="fab fa-whatsapp"></i><span class="wa-tooltip">Chat with us</span>';
        document.body.appendChild(a);
    }

    /* ── Cookie Consent ────────────────────────── */
    function initCookieConsent() {
        var STORAGE_KEY = 'alo_cookie_consent';
        if (localStorage.getItem(STORAGE_KEY)) return; // already decided

        var banner = document.createElement('div');
        banner.id = 'cookieBanner';
        banner.innerHTML =
            '<p>We use essential cookies to improve your experience on our site. Read our <a href="info.html#privacy">Privacy Policy</a> to learn more.</p>' +
            '<div class="cookie-actions">' +
            '  <button class="cookie-btn cookie-decline" id="cookieDecline">Decline</button>' +
            '  <button class="cookie-btn cookie-accept" id="cookieAccept">Accept</button>' +
            '</div>';
        document.body.appendChild(banner);

        // Small delay so the slide-up transition is visible
        setTimeout(function () { banner.classList.add('show'); }, 600);

        function dismiss(choice) {
            localStorage.setItem(STORAGE_KEY, choice);
            banner.classList.remove('show');
            setTimeout(function () { banner.remove(); }, 400);
        }

        document.getElementById('cookieAccept').addEventListener('click', function () { dismiss('accepted'); });
        document.getElementById('cookieDecline').addEventListener('click', function () { dismiss('declined'); });
    }

    /* ── Newsletter Form ───────────────────────── */
    function initNewsletter() {
        var form = document.getElementById('newsletterForm');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var email = form.querySelector('input[type="email"]').value.trim();
            if (!email) return;

            // Simulate submission (replace with real API call when ready)
            var successEl = document.getElementById('newsletterSuccess');
            form.style.display = 'none';
            if (successEl) successEl.style.display = 'block';

            // Store locally so the form stays hidden on revisit (optional)
            localStorage.setItem('alo_newsletter', email);
        });

        // If already subscribed, hide the form
        if (localStorage.getItem('alo_newsletter')) {
            var successEl = document.getElementById('newsletterSuccess');
            form.style.display = 'none';
            if (successEl) successEl.style.display = 'block';
        }
    }

    /* ── Contact Form Feedback ─────────────────── */
    function initContactForm() {
        var form = document.querySelector('.contact-form form');
        if (!form) return;

        // Inject success state
        var successDiv = document.createElement('div');
        successDiv.className = 'form-success';
        successDiv.innerHTML =
            '<div class="form-success-icon"><i class="fas fa-check"></i></div>' +
            '<h3>Message Sent!</h3>' +
            '<p>Thank you for reaching out. We\'ll get back to you within 1–2 business days.</p>';
        form.parentNode.insertBefore(successDiv, form.nextSibling);

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            form.style.display = 'none';
            successDiv.style.display = 'block';
        });
    }

    /* ── Active Nav Link (current page) ───────── */
    function initActiveNav() {
        var page = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('nav a').forEach(function (link) {
            var href = link.getAttribute('href');
            // Match shop page and info page exactly; don't re-mark anchor links
            if (href === page || href === page + '#home') {
                link.classList.add('active');
            }
        });
    }

    /* ── Init all ──────────────────────────────── */
    document.addEventListener('DOMContentLoaded', function () {
        initReveal();
        initScrollTop();
        initWhatsApp();
        initCookieConsent();
        initNewsletter();
        initContactForm();
        initActiveNav();
    });

})();
