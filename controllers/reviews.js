const Review = require("../models/review");
const Listing = require("../models/listing");

// Post a new review controller
module.exports.new = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review); 
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Review Listing Created!");
    res.redirect(`/listings/${listing._id}`);
};

// Delete a review controller
module.exports.delete = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted successfully");
    res.redirect(`/listings/${id}`);
}