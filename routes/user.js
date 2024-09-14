const express = require("express");
const router = express.Router(); 
const User = require("../models/user.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

router.get("/singup", (req, res) => {
    res.render("users/singup.ejs")
});

router.get("/login", (req, res) => {
    res.render("users/login.ejs")
});

router.post("/singup", wrapAsync(async(req, res) => {
    try{
        let {username, email, password} = req.body;
    const newUser = new User({email, username});
    await User.register(newUser, password);
    req.flash("success", "Welcome To Wonderlust");
    res.redirect("/listings");
    } catch(err) {
        req.flash("error", err.message);
        res.redirect("/singup");
    }
    
}));

router.post("/login",passport.authenticate("local",{ failureRedirect: "/login", failureFlash: true}), async(req, res) => {
    req.flash("success", "Welcome Back To Wonderlust");
    res.redirect("/listings");
});

module.exports = router;