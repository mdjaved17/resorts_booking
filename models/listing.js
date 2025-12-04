const mongoose = require("mongoose");
const review = require("./review");
const { ref } = require("joi");
const schema = mongoose.Schema;
const listingSchema = new schema({
  title: {
    type: String,
    required: true,
    maxLength: 50,
  },
  description: {
    type: String,

    maxLength: 200,
  },
  image: {
    url: String,
    filename: String,
  },
  price: {
    type: Number,

    default: 0,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: schema.Types.ObjectId,
    ref: "User",
  },
});

const listing = mongoose.model("listing", listingSchema);
module.exports = listing;
