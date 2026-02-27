const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path'); // Nécessaire pour lier le site web
require('dotenv').config();

const app = express();

// --- 🛡️ MIDDLEWARES DE SÉCURITÉ ---
app.use(helmet({
    contentSecurityPolicy: false // On désactive pour ne pas bloquer tes boutons PayPal et styles
})); 
app.use(cors());
app.use(express.json({ limit: '10kb' })); 

// Protection contre le spam
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);

// --- 🔗 CONNEXION BASE DE DONNÉES ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Base de données connectée ! 🛡️'))
  .catch(err => console.error('Erreur de connexion MongoDB :', err));

// --- 📍 ROUTES DU MOTEUR (API) ---
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/auth', require('./routes/auth'));

// --- 🎨 AFFICHER LE VISUEL DU SITE WEB (FRONTEND) ---
// Dit à Render de lire tous tes fichiers HTML/CSS qui sont à la racine
app.use(express.static(path.join(__dirname, '../')));

// --- ⚙️ LANCEMENT ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});