const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/holiday";

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
};

async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to database");

    await initDB();  // ✅ ensure DB is ready
}

main().catch((err) => console.log(err));
