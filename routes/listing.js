const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require('../schema.js');
const ExpressError = require("../utils/ExpressError.js");

const validateListings = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
        if(error) {
            let errmsg = error.details.map((el) => el.message).join(",");
            throw new ExpressError(400, errmsg);
         } else{
            next();
         }
};


router.get("/", wrapAsync( async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));
 
router.get("/new",  (req, res) => {
    res.render("listings/new.ejs");
});


router.get("/:id",  wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{ listing });
}));

router.post("/",validateListings, wrapAsync( async (req, res, next) => {
        
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect('/Listings');
}));

//Edit Route
router.get("/:id/edit", wrapAsync( async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{ listing });
}));

router.put("/:id", validateListings, wrapAsync( async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Edited successfully");
    res.redirect("/listings");
}));

router.delete("/:id", wrapAsync( async (req,res) => {
    let {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted successfully");
    res.redirect("/listings");
}));

module.exports = router;