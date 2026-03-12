const express= require("express");
const router=express.Router({ mergeParams: true });
const Reviews=require("../models/reviews.js");
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {validateReviews,isLoggedin,isAuthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js")


router.post("/",isLoggedin,validateReviews,wrapAsync(reviewController.createReview));

router.delete("/:reviewId",isLoggedin,isAuthor, reviewController.destroyReview);

module.exports = router;