import mongoose from 'mongoose';

const VitalsSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bp:          { type: String },
  heartRate:   { type: Number },
  temperature: { type: Number },
  bloodSugar:  { type: Number },
}, { timestamps: true });

export default mongoose.model('Vitals', VitalsSchema);