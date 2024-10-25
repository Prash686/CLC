const User = require("../models/user.js");
const ClcApplication = require('../models/ClcApplication');

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

module.exports.adminHome = async (req, res) => {
    try {
        // Find applications with status "pending" and populate the studentId field
        const applications = await ClcApplication.find({ status: 'Pending' }).populate("studentId");
        
        console.log(applications); // Log the pending applications
        res.render("admin/home.ejs", { applications }); // Render the student home page
    } catch (error) {
        console.error(error); // Log any errors
        res.status(500).send("Server error"); // Send an error response
    }
};


module.exports.checkStatus = async(req, res) => {
    const applications = await ClcApplication.find({ studentId: req.user._id }).populate("studentId");
    res.render("student/checkStatus.ejs",{applications}); // Render the student home page
};

module.exports.profile = async(req, res) => {
    const user = await  User.findById({ _id: req.user._id});
    res.render("profile.ejs",{user}); // Render the student home page
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
module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password, role, college, name} = req.body;
        const newUser = new User({ email, username, role, college, name }); // Include role here
        
        const registeredUser = await User.register(newUser, password);
        
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err); // Pass the error to next
            }
            req.flash("success", "Welcome to the CLC Portal");
            res.redirect("/home");
        });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};



module.exports.approveApplication = async (req, res) => {
    const { id } = req.params;
    try {
        await ClcApplication.findByIdAndUpdate(id, { status: 'Approved', dateReviewed: new Date() });
        req.flash("success", "Application approved.");
        res.redirect(`/view-application/${id}`);
    } catch (err) {
        req.flash("error", "Something went wrong.");
        res.redirect("/admin/home");
    }
};

module.exports.rejectApplication = async (req, res) => {
    const { id } = req.params;
    try {
        await ClcApplication.findByIdAndUpdate(id, { status: 'Rejected', dateReviewed: new Date() });
        req.flash("success", "Application rejected.");
        res.redirect(`/view-application/${id}`);
    } catch (err) {
        req.flash("error", "Something went wrong.");
        res.redirect("/admin/home");
    }
};

// Show (Admin views a specific application)
module.exports.getApplicationById = async (req, res) => {
    const { id } = req.params;
    const application = await ClcApplication.findById(id).populate("studentId");
    console.log(application,req.params);
    if (!application) {
        req.flash("error", "Application not found!");
        return res.redirect("/admin/home.ejs");
    }
    
    res.render("admin/view-application.ejs", { application });
};

// Handles the Login logic
module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to the CLC Portal");
    let redirectUrl = res.locals.redirectUrl || "/home"; // Redirect to CLC dashboard
    res.redirect(redirectUrl);
};
