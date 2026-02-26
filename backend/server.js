const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// --- 🛡️ MIDDLEWARES DE SÉCURITÉ ---
app.use(helmet()); 
app.use(cors());
app.use(express.json({ limit: '10kb' })); 

// Protection contre le spam de requêtes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 
});
app.use('/api/', limiter);

// --- 🔗 CONNEXION BASE DE DONNÉES ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Base de données connectée ! 🛡️'))
  .catch(err => console.error('Erreur de connexion MongoDB :', err));

// --- 📍 ROUTES ---
app.get('/', (req, res) => {
  res.send('Serveur ALLO KINÉ Sécurisé 🛡️');
});

// Route pour les rendez-vous
app.use('/api/appointments', require('./routes/appointments'));

// --- ⚙️ LANCEMENT UNIQUE ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));