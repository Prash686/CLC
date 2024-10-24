const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    Name: {
        type: String,
        required: true
    }
    ,email: {
        type: String,
        required: true
    },
    role: { type: String, enum: ['student', 'admin'] },
});

// Apply the passportLocalMongoose plugin to the userSchema
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
