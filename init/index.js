const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/test";

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
    owner: "66e54db1bba15061de32c0d0",
  }));
  await Listing.insertMany(updatedData);
  console.log("data was initialized");
};

initDB();
