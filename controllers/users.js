const User = require("../models/user.js");

// Renders the Signup page
module.exports.signedup = (req, res) => {
    res.render("users/signup.ejs"); // Adjusted to CLC Portal Signup
};

// Renders the Login page
module.exports.logedin = (req, res) => {
    res.render("users/login.ejs");
};

// Renders the Student Home page
module.exports.studentHome = (req, res) => {
    res.render("student/home.ejs"); // Render the student home page
};

module.exports.adminHome = (req, res) => {
    res.render("admin/home.ejs"); // Render the student home page
};

module.exports.apply = (req, res) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You need to log in to access the home page.");
        return res.redirect("/login");
    }
    res.render("student/new.ejs"); // Render the student home page
};

// Logout functionality
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
           return next(err);
        }
        req.flash("success", "You are logged out");
        res.redirect("/login");  // Redirect to login page after logout
    });
};

// Handles the Signup logic
module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        
        req.login(registeredUser, (err) => {
            if (err) {
               return next(err);
            }
            req.flash("success", "Welcome to the CLC Portal");
            res.redirect("/home");  // Redirect after signup
        });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

// Handles the Login logic
module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to the CLC Portal");
    let redirectUrl = res.locals.redirectUrl || "/home"; // Redirect to CLC dashboard
    res.redirect(redirectUrl);
};
