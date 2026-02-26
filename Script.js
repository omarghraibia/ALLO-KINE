document.addEventListener('DOMContentLoaded', () => {
    // Mode Sombre
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;
    
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const isDark = body.getAttribute('data-theme') === 'dark';
            body.setAttribute('data-theme', isDark ? 'light' : 'dark');
            themeBtn.textContent = isDark ? '🌙' : '☀️';
            localStorage.setItem('theme', isDark ? 'light' : 'dark');
        });
    }

    // Menu Mobile Amélioré (Croix + Fermeture au clic)
    const menuToggle = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // Transformer le hamburger en croix quand c'est ouvert
            if (navMenu.classList.contains('active')) {
                menuToggle.innerHTML = '✖';
            } else {
                menuToggle.innerHTML = '☰';
            }
        });

        // Fermer le menu automatiquement quand on clique sur un lien (sur téléphone)
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.innerHTML = '☰'; // Remettre le hamburger
            });
        });
    }

    // Reveal Animation au défilement
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});

// Gestion du formulaire d'avis
const reviewForm = document.getElementById('review-form');
const reviewsList = document.getElementById('reviews-list');

if (reviewForm) {
    reviewForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('reviewer-name').value;
        const rating = document.getElementById('reviewer-rating').value;
        const text = document.getElementById('reviewer-text').value;
        
        // Générer les étoiles
        let stars = '';
        for(let i=0; i<rating; i++) stars += '★';
        
        // Créer le nouvel élément HTML
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
        
        // Ajouter en haut de la liste
        reviewsList.prepend(newReview);
        
        // Réinitialiser le formulaire
        reviewForm.reset();
        alert("Merci pour votre avis !");
    });
}
// Activer le Service Worker pour la PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker enregistré !'))
            .catch(err => console.error('Erreur Service Worker :', err));
    });
}
// Assure-toi de remplacer 'votre-id-formulaire' par l'ID réel de ton formulaire HTML (ex: 'contact-form')
document.getElementById('votre-id-formulaire').addEventListener('submit', async (e) => {
    e.preventDefault(); // Empêche le rechargement classique de la page
    
    // 1. On récupère les valeurs tapées par le patient
    const formData = {
        nom: document.getElementById('nom').value,
        prenom: document.getElementById('prenom').value,
        telephone: document.getElementById('telephone').value,
        motif: document.getElementById('motif').value,
        diagnostic: document.getElementById('diagnostic').value
    };

    try {
        // 2. On envoie les données à notre API sécurisée
        const response = await fetch('http://localhost:5000/api/appointments', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(formData)
        });

        // 3. On vérifie la réponse du serveur
        if (response.ok) {
            alert("Rendez-vous enregistré avec succès dans la base de données !");
            e.target.reset(); // Vide les champs du formulaire
        } else {
            alert("Erreur lors de l'enregistrement du rendez-vous.");
        }
    } catch (error) {
        console.error("Erreur de connexion :", error);
        alert("Impossible de contacter le serveur. Vérifiez qu'il est bien lancé.");
    }
});