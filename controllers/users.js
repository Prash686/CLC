const User = require("../models/user.js");

module.exports.singedup = (req, res) => {
    res.render("users/singup.ejs"); // Note the correct file name too
};


module.exports.logedin = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err){
           return next(err);
        }
        req.flash("success", "You are loged out");
        res.redirect("/listings");
    });
};

module.exports.singup = async(req, res) => {
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if(err){
               return next(err);
            }
            req.flash("success", "Welcome To Wonderlust");
            res.redirect("/listings");
        });
    } catch(err) {
        req.flash("error", err.message);
        res.redirect("/singup");
    }
    
};

module.exports.login = async(req, res) => {
    req.flash("success", "Welcome Back To Wonderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);

}