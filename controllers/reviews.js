const Listing=require("../models/listing.js");
const Reviews=require("../models/reviews.js");

module.exports.createReview=async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Reviews(req.body.reviews);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);

    await listing.save();
    await newReview.save();

    console.log(listing);
    req.flash("success","New review added successfully!")
    res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview=async (req, res) => {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId }
    });

    await Reviews.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted successfully!")
    res.redirect(`/listings/${id}`);
}