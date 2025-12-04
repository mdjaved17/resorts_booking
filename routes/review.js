const express = require("express");
const router = express.Router( {mergeParams: true});
const wrapAsync = require("../utils/wrqapAsync.js");
const { reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const listing = require("../models/listing");
const Review= require("../models/review.js");
const { isLoggedIn } = require("../middleware.js");

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// write review
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    let list = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author= req.user._id,
    list.reviews.push(newReview);
    await newReview.save();
    await list.save();
    res.redirect(`/listings/${list._id}`);
  })
);

// router.delete("/:reviewId", isLoggedIn, wrapAsync(async(req, res)=>{
//   let {id, reviewId}= req.params;

//   await listing.findByIdAndUpdate
// }))

module.exports = router;