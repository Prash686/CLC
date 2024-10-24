const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isAdmin } = require("../middleware.js"); // Ensure you have an isAdmin middleware for admin checks
const clcController = require("../controllers/clcController.js");

// Route for students to apply for CLC
router.get("/apply-clc", isLoggedIn, clcController.new); // Render application form for students
router.post("/apply-clc", isLoggedIn, wrapAsync(clcController.applyForClc)); // Handle CLC application submission

// Admin routes for managing applications
router.route("/applications")
  .get(isAdmin, wrapAsync(clcController.getApplications)); // Admin views all applications

// Routes for a specific application
router.route("/applications/:id")
  .get(isAdmin, wrapAsync(clcController.getApplicationById)) // Admin views a specific application
  .put(isAdmin, wrapAsync(clcController.reviewApplication)) // Admin reviews application status
  .delete(isAdmin, wrapAsync(clcController.deleteApplication)); // Admin deletes an application

module.exports = router;
