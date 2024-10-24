const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    name: {
        type: String,
        required: true // Full name of the user (student/admin)
    },
    college: {
        type: String,
        required: true // Name of the college
    },
    email: {
        type: String,
        required: true,
        unique: true // Ensure email is unique
    },
    role: { 
        type: String, 
        enum: ['student', 'admin'], 
        required: true,
        default: 'student' // Default role is student
    },
    dateJoined: { 
        type: Date, 
        default: Date.now // Track when the user joined
    }
});

// Apply the passportLocalMongoose plugin to the userSchema for authentication
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
