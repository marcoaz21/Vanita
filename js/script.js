document.addEventListener('DOMContentLoaded', () => {

    /* ─── Mobile Menu Toggle ─── */
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks   = document.getElementById('nav-links');

    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('active');
            mobileMenu.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        // Chiudi menu quando si clicca un link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenu.setAttribute('aria-expanded', 'false');
            });
        });

        // Chiudi menu cliccando fuori
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                mobileMenu.setAttribute('aria-expanded', 'false');
            }
        });
    }

    /* ─── Reveal on Scroll ─── */
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target); // una sola volta
            }
        });
    }, { threshold: 0.12 });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ─── Brand Filtering (solo home) ─── */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const brandCards    = document.querySelectorAll('.brand-card');

    if (filterButtons.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                brandCards.forEach(card => {
                    const categories = card.getAttribute('data-category').split(' ');
                    if (filterValue === 'all' || categories.includes(filterValue)) {
                        card.classList.remove('hidden');
                        card.classList.add('active'); // assicura visibilità animazione
                    } else {
                        card.classList.add('hidden');
                    }
                });
            });
        });
    }

    /* ─── Smooth Scroll con offset header fisso ─── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const headerOffset = 80;
            const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    /* ─── Form Contatti (simulazione invio) ─── */
    const form     = document.getElementById('contact-form');
    const feedback = document.getElementById('form-feedback');

    if (form && feedback) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            feedback.className = 'form-feedback';
            feedback.textContent = '';

            const nome     = form.querySelector('#cf-nome').value.trim();
            const msg      = form.querySelector('#cf-messaggio').value.trim();

            if (!nome || !msg) {
                feedback.textContent = 'Per favore compila i campi obbligatori (nome e messaggio).';
                feedback.classList.add('error');
                return;
            }

            // Simulazione invio — qui puoi collegare Formspree, EmailJS, ecc.
            const submitBtn = form.querySelector('[type="submit"]');
            submitBtn.textContent = 'Invio in corso...';
            submitBtn.disabled = true;

            setTimeout(() => {
                feedback.textContent = 'Grazie ' + nome + '! Abbiamo ricevuto il tuo messaggio e ti risponderemo entro 24 ore.';
                feedback.classList.add('success');
                form.reset();
                submitBtn.textContent = 'Invia Messaggio';
                submitBtn.disabled = false;
            }, 1200);
        });
    }

});
