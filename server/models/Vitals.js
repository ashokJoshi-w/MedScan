const mongoose = require('mongoose');

const VitalsSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bp:          { type: String },
  heartRate:   { type: Number },
  temperature: { type: Number },
  bloodSugar:  { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Vitals', VitalsSchema);