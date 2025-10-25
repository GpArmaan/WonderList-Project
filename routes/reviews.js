const express=require("express");
const router=express.Router({mergeParams:true});
const asyncWrap=require("../utils/asyncWrap.js");
const expressError=require("../utils/expressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Review=require("../Models/reviews.js");
const Listing=require("../Models/Listing.js");;
const {isLoggedIn,isReviewAuthor}=require("../middlewares.js");

let validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new expressError(400,errmsg);
    }
    else{
        next();
    }
}


//Post route for adding review
router.post("/",isLoggedIn,validateReview,asyncWrap(async (req,res)=>{
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
}));

//Delete route for reviews
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,asyncWrap(async(req,res)=>{
    let {id,reviewId}=req.params;
    let listingUpdate=await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}}) // It will remove the review from the review array of the listing collection
    let deletedReview= await Review.findByIdAndDelete(reviewId); //it will delete the review from the review collection

    console.log(listingUpdate , deletedReview);
    // console.log(reviewId);
    req.flash("success","Review deleted");
    res.redirect(`/listings/${id}`);
}))

module.exports=router;