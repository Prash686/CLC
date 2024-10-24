const mongoose = require('mongoose');

const clcApplicationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  course: String,
  reason: String,
  status: { type: String, default: 'Pending', enum: ['Pending', 'Approved', 'Rejected'] },
  dateApplied: { type: Date, default: Date.now },
  dateReviewed: Date
});

module.exports = mongoose.model('ClcApplication', clcApplicationSchema);
