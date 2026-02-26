const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// --- 🛡️ MIDDLEWARES DE SÉCURITÉ (Priorité Haute) ---

// 1. Configuration globale de Helmet
app.use(helmet()); 

// 2. Masquer la stack technique pour éviter le scan de vulnérabilités
app.disable('x-powered-by');

// 3. Protection contre le Clickjacking
app.use(helmet.frameguard({ action: 'deny' }));

// 4. Configuration de la Content Security Policy (CSP) - Corrige l'erreur "Critique"
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://www.paypal.com"], 
      styleSrc: ["'self'", "'unsafe-inline'"], 
      imgSrc: ["'self'", "data:", "https:"], 
      connectSrc: ["'self'", "https://www.paypal.com"],
    },
  })
);

// 5. Autres en-têtes de sécurité
app.use(helmet.noSniff()); // Protection MIME sniffing
app.use(helmet.referrerPolicy({ policy: 'strict-origin-when-cross-origin' }));

// 6. Restriction des fonctionnalités navigateur
app.use((req, res, next) => {
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
});

// --- ⚙️ CONFIGURATION RÉSEAU & PARSING ---

app.use(cors());
app.use(express.json({ limit: '10kb' })); // Protection contre les attaques DOS

// Protection contre le brute-force et le spam
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 
});
app.use('/api/', limiter);

// --- 🔗 CONNEXION BASE DE DONNÉES ---

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Base de données connectée avec succès ! 🛡️'))
  .catch(err => console.error('Erreur de connexion MongoDB :', err));

// --- 📍 ROUTES ---

app.get('/', (req, res) => {
  res.send('Serveur ALLO KINÉ Sécurisé 🛡️');
});

// Route pour la gestion des rendez-vous
app.use('/api/appointments', require('./routes/appointments'));

// --- 🚀 LANCEMENT DU SERVEUR ---

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});

// Ajoutez ceci avec vos autres routes
app.use('/api/auth', require('./routes/auth'));