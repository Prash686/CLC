const ClcApplication = require('../models/ClcApplication');

// Index (Admin views all applications)
module.exports.index = async (req, res) => {
    const allApplications = await ClcApplication.find({});
    res.render("applications/index.ejs", { allApplications });
};



// New (Student applies for a CLC)
module.exports.new = (req, res) => {
    res.render("student/new.ejs"); // Corrected path to the new.ejs file
};

// Create (Create a new CLC application)
module.exports.create = async (req, res) => {
    try {
        // Log the incoming data
        console.log(req.body); // Check what data is being sent
        
        // Create a new application with the incoming data
        const newApplication = new ClcApplication(req.body.application);
        
        newApplication.studentId = req.user._id; // Set the student ID from the logged-in user
        
        // Check the values being set
        console.log('New Application:', newApplication);
        
        await newApplication.save();
        req.flash("success", "New CLC Application submitted successfully!");
        res.redirect('/home');
    } catch (error) {
        console.error('Error saving application:', error); // Log any errors
        req.flash("error", "Failed to submit the application. Please try again.");
        res.redirect('/clc/apply-clc'); // Redirect back to the form on error
    }
};


// Edit (Admin edits CLC application)
module.exports.edit = async (req, res) => {
    const { id } = req.params;
    const application = await ClcApplication.findById(id);
    if (!application) {
        req.flash("error", "Application not found!");
        return res.redirect("/applications");
    }
    res.render("applications/edit.ejs", { application });
};

// Update (Update application status)
module.exports.update = async (req, res) => {
    const { id } = req.params;
    await ClcApplication.findByIdAndUpdate(id, { ...req.body.application });
    req.flash("success", "Application updated successfully");
    res.redirect(`/applications/${id}`);
};

// Delete (Admin deletes a CLC application)
module.exports.delete = async (req, res) => {
    const { id } = req.params;
    await ClcApplication.findByIdAndDelete(id);
    req.flash("success", "Application deleted successfully");
    res.redirect("/applications");
};

module.exports.getDashboard = async (req, res) => {
    const totalApplications = await ClcApplication.countDocuments();
    const pendingApplications = await ClcApplication.countDocuments({ status: 'Pending' });
    const approvedApplications = await ClcApplication.countDocuments({ status: 'Approved' });
    const rejectedApplications = await ClcApplication.countDocuments({ status: 'Rejected' });

    res.render('admin/dashboard', { totalApplications, pendingApplications, approvedApplications, rejectedApplications });
};
