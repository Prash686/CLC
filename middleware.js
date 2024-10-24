const ClcApplication = require("./models/ClcApplication.js"); // Ensure this model exists
const ExpressError = require("./utils/ExpressError.js");

// Middleware to check if a user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Please Login To Access This Page");
        return res.redirect("/login");
    }
    next();
};

// Middleware to save the redirect URL after login
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

// Middleware to check if a user is an admin
module.exports.isAdmin = (req, res, next) => {
    if (res.locals.currUser.role !== 'admin') {
        req.flash("error", "You do not have permission to perform this action");
        return res.redirect("/clc/applications"); // Redirect to a relevant page
    }
    next();
};

// Middleware to validate CLC applications
module.exports.validateClcApplication = (req, res, next) => {
    const { course, reason } = req.body; // Adjust this based on your form fields
    if (!course || !reason) {
        throw new ExpressError("Course and reason are required.", 400);
    }
    next();
};
