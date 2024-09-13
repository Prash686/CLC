const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number, // Use Number instead of String for rating
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date, // Use JavaScript's built-in Date object
        default: Date.now, // Set the default to the current date
    },
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
