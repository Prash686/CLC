const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { isLoggedIn, isAdmin } = require("../middleware");
const userController = require("../controllers/users");
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });

// Combine routes for /signup (GET and POST)
router.route("/signup")
  .get(userController.signedup)
  .post(wrapAsync(userController.signup));

// Combine routes for /login (GET and POST)
router.route("/login")
  .get(userController.logedin)
  .post(passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }), userController.login);

// Route for students to apply for CLC
router.route("/apply-clc")
  .get(userController.apply)
  .post(wrapAsync(userController.submitClcApplication));

// Logout route
router.get("/logout", userController.logout);

// Check application status
router.get("/check-status", userController.checkStatus);

// Profile page
router.get("/profile", userController.profile);

// Admin home route
router.get("/admin/home", isAdmin, userController.adminHome);

// Student home route
router.get("/home", userController.studentHome);

// Admin views a specific application
router.route("/view-application/:id")
  .get(isAdmin, wrapAsync(userController.getApplicationById));

// Approve/reject application routes with file upload for approval
router.post('/application/:id/approve', isAdmin, upload.single('clcDocument'), userController.approveApplication);
router.post('/application/:id/reject', isAdmin, userController.rejectApplication);

module.exports = router;
