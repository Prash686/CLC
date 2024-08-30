const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing =require("./models/listing.js");
const path = require ("path");


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
    let listing = req.body.Listing;
    console.log(listing);
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

