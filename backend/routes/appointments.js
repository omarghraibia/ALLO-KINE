const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

router.post('/', async (req, res) => {
    try {
        const newAppointment = new Appointment(req.body);
        const appointment = await newAppointment.save();
        res.json(appointment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur');
    }
});

module.exports = router;
