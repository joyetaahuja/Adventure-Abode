const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const db_url = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(db_url);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner:
      "665f1a4ea2e05536b75df992",
  }));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
