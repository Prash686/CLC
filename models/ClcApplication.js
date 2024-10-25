const mongoose = require('mongoose');

const ClcApplicationSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: String,
    reason: String,
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    dateApplied: {
        type: Date,
        default: Date.now
    },
    dateReviewed: Date,
    documentUploaded: String, // To store Cloudinary URL
    remarks: String
});

module.exports = mongoose.model('ClcApplication', ClcApplicationSchema);
