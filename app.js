if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const clcApplicationRoutes = require("./routes/clcApplication"); // Updated route for CLC applications
const userRoutes = require("./routes/user");
const bdUrl = process.env.MONGODB_URI || "mongodb+srv://prash:prash%4011@cluster0.p4iok.mongodb.net/myDatabase?retryWrites=true&w=majority"; // Ensure this is formatted correctly

const store = MongoStore.create({
    mongoUrl: bdUrl,
    crypto: {
        secret: process.env.SESSION_SECRET || "mysecret", // Use environment variable for security
    },
    touchAfter: 24 * 60 * 60,
});

store.on("error", (err) => {
    console.log("Error in MONGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    secret: process.env.SESSION_SECRET || "mysecret", // Use environment variable for security
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
    }
};

main().then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.log(err);
});


async function main() {
    try {
        await mongoose.connect(bdUrl);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user; // Track the current user
    next();
});

// Updated routes for CLC portal
app.use("/clc", clcApplicationRoutes); // Route for CLC applications
app.use("/", userRoutes); // User routes for signup/login/logout

// Handle all 404 errors
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// Error handler
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message }); // Updated to a general error page
});

app.listen(8080, () => {
    console.log("Server running on port 8080");
});
