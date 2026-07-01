import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
  userId:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileName:       { type: String },
  analysisResult: { type: Object },
  status:         { type: String, default: 'Normal' },
  type:           { type: String, enum: ['report', 'prescription', 'vitals'] },
}, { timestamps: true });

export default mongoose.model('Report', ReportSchema);