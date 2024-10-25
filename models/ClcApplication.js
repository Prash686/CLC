const mongoose = require('mongoose');

const clcApplicationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the student user
  course: { type: String, required: true }, // Course name or description with validation
  reason: { type: String, required: true }, // Reason for leaving the college with validation
  description: { type: String,}, // Reason for leaving the college with validation
  status: { type: String, default: 'Pending', enum: ['Pending', 'Approved', 'Rejected'] }, // Application status
  dateApplied: { type: Date, default: Date.now }, // Date when the application was submitted
  dateReviewed: Date, // Date when the application was reviewed by the admin
  remarks: String, // Admin comments or feedback on the application
  documentUploaded: String // Path to any uploaded document (optional)
});

module.exports = mongoose.model('ClcApplication', clcApplicationSchema);
