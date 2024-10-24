const ClcApplication = require('../models/ClcApplication');

// Student applies for CLC
exports.applyForClc = async (req, res) => {
  try {
    const newApp = new ClcApplication({ ...req.body, studentId: req.user._id });
    await newApp.save();
    res.status(200).json({ message: 'Application submitted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Error submitting application' });
  }
};

// Admin reviews CLC application
exports.reviewApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const application = await ClcApplication.findById(id);
    if (!application) return res.status(404).json({ error: 'Application not found' });
    
    application.status = status;
    application.dateReviewed = new Date();
    await application.save();
    res.status(200).json({ message: 'Application reviewed' });
  } catch (error) {
    res.status(400).json({ error: 'Error reviewing application' });
  }
};

//Index controller
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

//Show controller
module.exports.show = async (req, res) => {
  let {id} = req.params;
  const listing = await Listing.findById(id).populate({
      path: "reviews",
      populate: {
          path: "author",
      },
  }).populate("owner");

  if (!listing) {
      req.flash("error", "Listing you requested for does not exist!");
      return res.redirect("/listings");
  }

  let response;
  try {
      response = await geocodingClient.forwardGeocode({
          query: listing.location,
          limit: 1
      }).send();
  } catch (e) {
      console.error("Geocoding error:", e);
      req.flash("error", "There was an error fetching location data!");
      return res.redirect("/listings");
  }

  // Safeguard to check if response has the necessary features

  res.render("listings/show.ejs", { listing });
};


// Create Route
module.exports.create = (req, res) => {
  res.render("listings/new.ejs");
}

//New controller
module.exports.new = async (req, res) => {
  let response = await geocodingClient.forwardGeocode({
      query: req.body.listing.location,
      limit: 1
  }).send();
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.image = {url, filename};
  newListing.geometry = response.body.features[0].geometry;
  newListing.owner = req.user._id;
  let savedListing = await newListing.save();
  console.log(savedListing);
  req.flash("success", "New Listing Created!");
  res.redirect('/listings');
};

//Edit controller
module.exports.edit = async (req, res) => {
  let {id} = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
      req.flash("error", "Listing you requested for does not exist!");
      res.redirect("/listings");
  }

  let originalImage = listing.image.url;
  originalImage = originalImage.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs",{ listing, originalImage});
};

// Update Route
module.exports.update = async (req, res) => {
  let {id} = req.params;
  let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
  
  if(typeof req.file !== "undefined"){
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = {url, filename};
      await listing.save();
  }

  req.flash("success", "Listing Edited successfully");
  res.redirect(`/listings/${id}`);
};

//Delete controller
module.exports.delete = async (req, res) => {
  let {id} = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted successfully");
  res.redirect("/listings");
};
