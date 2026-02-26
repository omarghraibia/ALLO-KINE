const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User'); // Assurez-vous que ce chemin est correct

dotenv.config();

const seedAdmin = async () => {
    try {
        // Connexion à la base de données
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connecté à MongoDB pour l\'initialisation...');

        // Vérifier si l'admin existe déjà
        const adminExists = await User.findOne({ email: 'omar_oumay@hotmail.com' }); // Email récupéré depuis votre formulaire
        if (adminExists) {
            console.log('L\'administrateur existe déjà.');
            process.exit();
        }

        // Hachage du mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('VotreMotDePasseSecurise123!', salt);

        // Création de l'utilisateur
        const admin = new User({
            email: 'omar_oumay@hotmail.com',
            password: hashedPassword,
            role: 'admin'
        });

        await admin.save();
        console.log('Compte administrateur créé avec succès ! 🛡️');
        process.exit();
    } catch (err) {
        console.error('Erreur lors de la création de l\'admin :', err);
        process.exit(1);
    }
};

seedAdmin();