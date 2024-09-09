const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing =require("./models/listing.js");
const path = require ("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require('./schema.js');


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
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/", (req , res) => {
    res.send("succes");
});

const validateListings = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
        if(error) {
            let errmsg = error.details.map((el) => {
                el.message
            }).join(",");
            throw new ExpressError(400, errmsg);
         } else{
            next();
         }
};

app.get("/listings",validateListings, wrapAsync( async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));
 
app.get("/listings/new",  (req, res) => {
    res.render("listings/new.ejs");
});


app.get("/listings/:id",  wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{ listing });
}));

app.post("/listings", wrapAsync( async (req, res, next) => {
        
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect('/Listings');
}));

//Edit Route
app.get("/Listing/:id/edit", wrapAsync( async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{ listing });
}));

app.put("/listings/:id", validateListings, wrapAsync( async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect("/listings");
}));

app.delete("/listings/:id", wrapAsync( async (req,res) => {
    let {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));


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

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) =>{
    let {statusCode = 500 , message = "Something Whent wrong"} = err;
    res.status(statusCode).render("listings/error.ejs", {message});
    // res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("success");
    // res.
})

