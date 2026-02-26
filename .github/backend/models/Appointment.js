const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  telephone: { type: String, required: true },
  motif: { 
    type: String, 
    enum: ['Consultation Cabinet', 'Soins Domicile', 'Bilan Visio', 'Achat Programme'],
    required: true 
  },
  diagnostic: { type: String, required: true },
  seances: { type: Number, default: 1 },
  statut: { 
    type: String, 
    enum: ['en_attente', 'confirmé', 'annulé'], 
    default: 'en_attente' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);