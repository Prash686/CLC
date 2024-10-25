const express = require("express");
const router = express.Router(); 
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { isLoggedIn, isAdmin } = require("../middleware.js");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

// Combine routes for /signup (GET and POST)
router.route("/signup")
  .get(userController.signedup)  // GET - Signup page
  .post(wrapAsync(userController.signup));  // POST - Signup form submission

// Combine routes for /login (GET and POST)
router.route("/login")
  .get(userController.logedin)  // GET - Login page
  .post(saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }), userController.login);  // POST - Login form submission

// Route for students to apply for CLC (no need to authenticate again for form submission)
router.route("/apply-clc")
  .get(userController.apply)  // GET - Application form page (requires user to be logged in)
  .post(wrapAsync(userController.submitClcApplication));  // POST - Handle form submission

// Logout route
router.get("/logout", userController.logout);

router.get("/check-status", userController.checkStatus);

router.get("/profile", userController.profile);


// Admin home route
router.get( "/admin/home", isAdmin, userController.adminHome);  // GET - Admin home page

// Student home route
router.get("/home", userController.studentHome);  // GET - Student home page

router.route("/view-application/:id", isAdmin,)
  .get(wrapAsync(userController.getApplicationById)) // Admin views a specific application
  // .put(isAdmin, wrapAsync(userController.reviewApplication)) // Admin reviews application status
  // .delete(isAdmin, wrapAsync(userController.deleteApplication)); // Admin deletes an application

router.post('/application/:id/approve', userController.approveApplication);
router.post('/application/:id/reject', userController.rejectApplication);

module.exports = router;
