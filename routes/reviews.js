const express=require("express");
const router=express.Router({mergeParams:true});
const asyncWrap=require("../utils/asyncWrap.js");
const expressError=require("../utils/expressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Review=require("../Models/reviews.js");
const Listing=require("../Models/Listing.js");
const {isLoggedIn,isReviewAuthor}=require("../middlewares.js");

const reviewControllers=require("../controllers/review.js");

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
router.post("/",isLoggedIn,validateReview,asyncWrap(reviewControllers.postReview));

//Delete route for reviews
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,asyncWrap(reviewControllers.destroyReview));

module.exports=router;