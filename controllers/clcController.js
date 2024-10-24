const ClcApplication = require('../models/ClcApplication');

// Index (Admin views all applications)
module.exports.index = async (req, res) => {
    const allApplications = await ClcApplication.find({});
    res.render("applications/index.ejs", { allApplications });
};

// Show (Admin views a specific application)
module.exports.show = async (req, res) => {
    const { id } = req.params;
    const application = await ClcApplication.findById(id).populate("student");

    if (!application) {
        req.flash("error", "Application not found!");
        return res.redirect("/applications");
    }
    
    res.render("applications/show.ejs", { application });
};

// New (Student applies for a CLC)
module.exports.new = (req, res) => {
    res.render("applications/new.ejs");
};

// Create (Create a new CLC application)
module.exports.create = async (req, res) => {
    const newApplication = new ClcApplication(req.body.application);
    newApplication.student = req.user._id;
    await newApplication.save();
    req.flash("success", "New CLC Application submitted successfully!");
    res.redirect('/applications');
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
    const updatedApp = await ClcApplication.findByIdAndUpdate(id, { ...req.body.application });
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
