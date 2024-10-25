const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isAdmin } = require("../middleware.js");
const clcController = require("../controllers/clcController.js");

// Route for students to apply for CLC
router.get("/apply-clc", isLoggedIn, clcController.new); // Render application form for students
router.post("/apply-clc", isLoggedIn, wrapAsync(clcController.create)); // Handle CLC application submission



router.get("/dashboard", isAdmin, wrapAsync(clcController.getDashboard));

module.exports = router;
