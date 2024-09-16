const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListings } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


// Create Route
router.get("/new", isLoggedIn, listingController.create);

// Combine route for index and create
router.route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn, upload.single('listing[image][filename]'), validateListings, wrapAsync(listingController.new));
// Combine routes for /:id (Show, Update, Delete)
router.route("/:id")
  .get(wrapAsync(listingController.show))            // Show Route
  .put(isLoggedIn, isOwner, upload.single('listing[image][filename]'), validateListings, wrapAsync(listingController.update))  // Update Route
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.delete));  // Delete Route

// Edit Route (remains separate because it's a GET to a different endpoint)
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.edit));

module.exports = router;
