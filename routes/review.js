const express = require("express");
const router = express.Router({mergeParams: true});
// const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js"); 
const{listingSchema,reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
// const reviewController = require("../controllers/review.js");


router.post("/",async (req,res) =>{
  let listing =  await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);

  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();
  req.flash("success", "New Review Created!");


  res.redirect(`/listings/${listing._id}`);
});


router.put("/:id",async (req,res)=>{
  let {id} = req.params;
  await Listing.findByIdAndUpdate(id, {...req.body.listing});
  req.flash("success","Listing Updated!");
  res.redirect(`/listings/${id}`);
});




router.delete("/:reviewId",async(req,res)=>{
  let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted!");


   res.redirect(`/listings/${id}`);
  
});

module.exports=router;
