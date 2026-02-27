document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. GESTION DU MODE SOMBRE ---
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;
    
    if (themeBtn) {
        // Charger la préférence enregistrée
        if (localStorage.getItem('theme') === 'dark') {
            body.setAttribute('data-theme', 'dark');
            themeBtn.textContent = '☀️';
        }

        themeBtn.addEventListener('click', () => {
            const isDark = body.getAttribute('data-theme') === 'dark';
            body.setAttribute('data-theme', isDark ? 'light' : 'dark');
            themeBtn.textContent = isDark ? '🌙' : '☀️';
            localStorage.setItem('theme', isDark ? 'light' : 'dark');
        });
    }

    // --- 2. MENU MOBILE AMÉLIORÉ ---
    const menuToggle = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // Transformer le hamburger en croix
            menuToggle.innerHTML = navMenu.classList.contains('active') ? '✖' : '☰';
        });

        // Fermer le menu au clic sur un lien
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.innerHTML = '☰';
            });
        });
    }

    // --- 3. ANIMATIONS AU DÉFILEMENT (REVEAL) ---
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


    // --- 4. FORMULAIRE DE RENDEZ-VOUS SECURISE ---
    const contactForm = document.getElementById('contact-form'); // Assure-toi que l'ID est 'contact-form' dans ton HTML
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                nom: document.getElementById('nom').value,
                prenom: document.getElementById('prenom').value,
                telephone: document.getElementById('telephone').value,
                motif: document.getElementById('motif').value,
                diagnostic: document.getElementById('diagnostic').value
            };

            try {
                const token = localStorage.getItem('token');
                // Remplace http://localhost:5000 par ton nouveau lien Render
                // Dans ton fichier script.js
                const response = await fetch('https://ton-projet-backend.onrender.com/api/appointments', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'x-auth-token': localStorage.getItem('token') || '' 
                    },
                    body: JSON.stringify(formData)
                });
                if (response.ok) {
                    alert("Rendez-vous enregistré avec succès !");
                    contactForm.reset();
                } else {
                    alert("Erreur lors de l'enregistrement.");
                }
            } catch (error) {
                console.error("Erreur connexion:", error);
                alert("Impossible de contacter le serveur.");
            }
        });
    }

    // --- 5. GESTION DES AVIS ---
    const reviewForm = document.getElementById('review-form');
    const reviewsList = document.getElementById('reviews-list');

    if (reviewForm && reviewsList) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('reviewer-name').value;
            const rating = document.getElementById('reviewer-rating').value;
            const text = document.getElementById('reviewer-text').value;
            
            let stars = '★'.repeat(rating);
            
            const newReview = document.createElement('div');
            newReview.className = 'review-card reveal active';
            newReview.style.cssText = 'background: var(--card-bg); padding: 1.5rem; border-left: 4px solid var(--gold-accent); border-radius: 8px; margin-top: 1rem;';
            newReview.innerHTML = `
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <strong>${name}</strong>
                    <span style="color: var(--gold-accent);">${stars}</span>
                </div>
                <p style="font-size: 0.95rem; opacity: 0.8;">"${text}"</p>
            `;
            reviewsList.prepend(newReview);
            reviewForm.reset();
            alert("Merci pour votre avis !");
        });
    }
});

// --- 6. SERVICE WORKER (PWA) ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(() => console.log('PWA prête !'))
            .catch(err => console.error('Erreur PWA:', err));
    });
}