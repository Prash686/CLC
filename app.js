const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing =require("./models/listing.js");
const path = require ("path");
const methodOverride = require("method-override");


const Mongoose = "mongodb://127.0.0.1:27017/test";

main().then( () => {
    console.log("connected");
}).catch(err => {
    console.log(err);
});

async function main(){
    await mongoose,mongoose.connect(Mongoose);
}

app.set("view engine", "ejs");
app.set("views",path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

app.get("/", (req , res) => {
    res.send("succes");
});

app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
});
 
app.get("/listings/new", async (req, res) => {
    await res.render("listings/new.ejs");
});


app.get("/listings/:id", async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{ listing });
});

app.post("/listings", async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect('/Listings');
});

//Edit Route
app.get("/Listing/:id/edit", async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{ listing });
});

app.put("/listings/:id", async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect("/listings");
});

app.delete("/listings/:id", async (req,res) => {
    let {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});


// app.get ("/testListing", async (req,res) => {
//     let sampleListing =ing = new Listing({
//         title : "Raj Villa",
//         Description : "Best Service at this Villa",
//         price : 1200,
//         location : "Sidani",
//         country : "Australia"
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful");
// });

app.listen(8080, () => {
    console.log("success");
    // res.
})

