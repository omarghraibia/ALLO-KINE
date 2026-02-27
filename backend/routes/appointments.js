const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
    try {
        const appointments = await Appointment.find().sort({ createdAt: -1 });
        res.json(appointments);
    } catch (err) { res.status(500).send('Erreur serveur'); }
});
module.exports = router;
