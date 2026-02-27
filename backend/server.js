const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();

// --- 🛡️ MIDDLEWARES DE SÉCURITÉ ---
app.use(helmet({
  contentSecurityPolicy: false // Désactivé pour que ton CSS et tes images s'affichent bien
}));
app.use(cors());
app.use(express.json({ limit: '10kb' })); 

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);

// --- 🔗 CONNEXION BASE DE DONNÉES ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Base de données connectée ! 🛡️'))
  .catch(err => console.error('Erreur de connexion MongoDB :', err));

// --- 📍 ROUTES DE L'API (Connexion & Rendez-vous) ---
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/auth', require('./routes/auth'));

// --- 🎨 AFFICHER LE VISUEL DU SITE WEB (FRONTEND) ---
// On indique à Node.js de chercher les fichiers HTML/CSS dans le dossier parent
app.use(express.static(path.join(__dirname, '../')));

// CORRECTION ICI : On utilise une syntaxe compatible avec les nouvelles versions
app.get(/^(?!\/api).+/, (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// --- ⚙️ LANCEMENT DU SERVEUR ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});