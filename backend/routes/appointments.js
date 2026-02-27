const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const auth = require('../middleware/auth');

router.post('/', async (req, res) => {
    try {
        const newAppointment = new Appointment(req.body);
        if (req.header('x-auth-token')) {
            const jwt = require('jsonwebtoken');
            const decoded = jwt.verify(req.header('x-auth-token'), process.env.JWT_SECRET);
            newAppointment.patientId = decoded.user.id;
        }
        const appointment = await newAppointment.save();
        res.json(appointment);
    } catch (err) {
        res.status(500).send('Erreur Serveur');
    }
});

router.get('/me', auth, async (req, res) => {
    try {
        const appointments = await Appointment.find({ patientId: req.user.id }).sort({ createdAt: -1 });
        res.json(appointments);
    } catch (err) {
        res.status(500).send('Erreur Serveur');
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const appointments = await Appointment.find().sort({ createdAt: -1 });
        res.json(appointments);
    } catch (err) {
        res.status(500).send('Erreur Serveur');
    }
});

module.exports = router;
