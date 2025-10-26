const Review=require("../Models/reviews.js");
const Listing=require("../Models/Listing.js");

module.exports.postReview=async (req,res)=>{
    let {id}=req.params;
    console.log(id);
    let listing=await Listing.findById(id);
    let newReview=new Review(req.body.reviews);
    newReview.author=req.user._id;
    console.log(req.user.username);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("Review added");
    // req.flash("success","Your review added");
    res.redirect(`/listings/${id}/reviews`);
}


module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    let listingUpdate=await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}}) // It will remove the review from the review array of the listing collection
    let deletedReview= await Review.findByIdAndDelete(reviewId); //it will delete the review from the review collection

    console.log(listingUpdate , deletedReview);
    // console.log(reviewId);
    req.flash("success","Review deleted");
    res.redirect(`/listings/${id}`);
}