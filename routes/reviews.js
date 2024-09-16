const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams to access :id from parent router
const wrapAsync = require("../utils/wrapAsync");
const {isLoggedIn, validateReviews, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

// Post a new review
router.post("/", isLoggedIn, validateReviews, wrapAsync(reviewController.new));

// Delete a review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor,wrapAsync(reviewController.delete));

module.exports = router;
