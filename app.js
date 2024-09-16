if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
// console.log(process.env.secret);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session"); // Declare session once
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRoutes = require("./routes/listing");
const reviewRoutes = require("./routes/reviews"); 
const userRoutes = require("./routes/user");


const sessionOptions = {
    secret: "mysecret",
    resave: false,
    saveUninitialized: true,
    cookie: { // Change Cookie to cookie
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true, // Ensures the cookie is only accessible by the web server
    }
};


const Mongoose = "mongodb://127.0.0.1:27017/test";

main().then(() => {
    console.log("connected");
}).catch(err => {
    console.log(err);
});

async function main() {
    await mongoose.connect(Mongoose);
}

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes); 
app.use("/",userRoutes);

app.get("/", (req, res) => {
    res.send("success");
});

// Handle all 404 errors
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// Error handler
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("listings/error.ejs", { message });
});

app.listen(8080, () => {
    console.log("Server running on port 8080");
});
