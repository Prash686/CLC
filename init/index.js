const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb+srv://prash:prash%4011@cluster0.p4iok.mongodb.net/myDatabase?retryWrites=true&w=majority";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  // Fix: Referencing initData.data instead of initDB.data
  const updatedData = initData.data.map((obj) => ({
    ...obj,
    owner: "66e7fc25dfe429d6099b1302",
  }));
  await Listing.insertMany(updatedData);
  console.log("data was initialized");
};

initDB();
