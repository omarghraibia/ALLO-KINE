const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { body, validationResult } = require('express-validator');

// @route   POST api/appointments
// @desc    Créer une demande de rendez-vous
// @access  Public
router.post('/', [
    // Validation Cybersécurité : on nettoie les entrées pour éviter les injections XSS
    body('nom').trim().escape().notEmpty(),
    body('prenom').trim().escape().notEmpty(),
    body('telephone').trim().escape().notEmpty(),
    body('motif').isIn(['Consultation Cabinet', 'Soins Domicile', 'Bilan Visio', 'Achat Programme']),
    body('diagnostic').trim().escape().notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const newAppointment = new Appointment({
            nom: req.body.nom,
            prenom: req.body.prenom,
            telephone: req.body.telephone,
            motif: req.body.motif,
            diagnostic: req.body.diagnostic,
            seances: req.body.seances || 1
        });

        const appointment = await newAppointment.save();
        res.json({ msg: "Demande enregistrée avec succès !", id: appointment._id });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur');
    }
});
const auth = require('../middleware/auth');

// @route   GET api/appointments
// @desc    Obtenir tous les rendez-vous (Protégé)
router.get('/', auth, async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).send('Erreur Serveur');
  }
});
module.exports = router;