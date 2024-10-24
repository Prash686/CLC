const express = require("express");
const router = express.Router(); 
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
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

router.route("/apply-clc")
  .get(userController.apply)  // GET - Login page
  .post(saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }), userController.login);
  // .post(saveRedirectUrl, passport.authenticate("local", {
  //   failureRedirect: "/login",
  //   failureFlash: true
  // }), userController.login); 

// Logout route
router.get("/logout", userController.logout);

router.get("/admin/home", userController.adminHome);  // GET - Student home page

// Home route for students
router.get("/home", userController.studentHome);  // GET - Student home page



module.exports = router;
