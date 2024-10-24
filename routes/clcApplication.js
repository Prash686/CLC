const express = require('express');
const router = express.Router();
const { applyForClc, reviewApplication, getApplications } = require('../controllers/clcController');

router.post('/apply', applyForClc);  // Student
router.put('/review/:id', reviewApplication); // Admin
router.get('/applications', getApplications); // Admin

module.exports = router;
