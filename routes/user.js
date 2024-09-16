const express = require("express");
const router = express.Router(); 
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

// Combine routes for /signup (GET and POST)
router.route("/singup")
  .get(userController.singedup)  // GET - Signup page
  .post(wrapAsync(userController.singup));  // POST - Signup form submission

// Combine routes for /login (GET and POST)
router.route("/login")
  .get(userController.logedin)  // GET - Login page
  .post(saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }), userController.login);  // POST - Login form submission

// Logout route remains as a separate GET request
router.get("/logout", userController.logout);

module.exports = router;
