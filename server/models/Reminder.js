import mongoose from 'mongoose';

const ReminderSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:       { type: String, required: true },
  description: { type: String },
  isActive:    { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Reminder', ReminderSchema);