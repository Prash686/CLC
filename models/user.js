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
    phone: {
        type: String,
        required: false // Optional phone number
    },
    address: {
        type: String,
        required: false // Optional address
    },
    state: {
        type: String,
        required: false // Optional state
    },
    course: {
        type: String,
        required: false // Optional course
    },
    graduationYear: {
        type: String,
        required: false // Optional graduation year
    },
    rollNumber: {
        type: String,
        required: false // Optional institute number
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

module.exports = mongoose.model("User", userSchema);
