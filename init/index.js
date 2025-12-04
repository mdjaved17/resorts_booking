const initData = require("./data.js");
const listing = require("../models/listing.js");

const mongoose = require("mongoose");
main()
  .then(() => {
    console.log("Connecton successful");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/resort");
}

const initDB = async () => {
  await listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "68e7b04561043983be6e8361",
  }));
  await listing.insertMany(initData.data);
};

initDB();
