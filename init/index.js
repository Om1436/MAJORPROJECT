const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

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

// const initDB = async () => {
//   await Listing.deleteMany({});
//   initData.data=initData.data.map((obj)=>({...obj,owner:"67a3cc86952e4b5448cc9f19"}))
//   await Listing.insertMany(initData.data);
//   console.log("data was initialized");
// };

const initDB = async () => {
  try {
      await Listing.deleteMany({});
      initData.data = initData.data.map((obj) => ({
          ...obj,
          owner: new mongoose.Types.ObjectId("67a3cc86952e4b5448cc9f19")
      }));
      await Listing.insertMany(initData.data);
      console.log("Data was initialized successfully!");
  } catch (error) {
      console.error("Error initializing data:", error);
  }
};

initDB();