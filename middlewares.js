module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl; //it is needed to be stored the last visited page of the user  because if the user is not logged in and i he tries
                                                 // to login then the last visited page will be lost
        req.flash("error","Login to proceed");
        return res.redirect("/login");
    }
    next();
} 

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl; //so the above saved last visited page helps to redirect to that page only after we log in or sign up.
    }
    next();
}

// The above one is a middleware funtion which checks whether the user is authenticated or not 
// if the user is not authenticated and wants to do some activity then he/she must login first

const Listing=require("./Models/Listing.js");
module.exports.isOwner=async(req,res,next)=>{ // This middleware is for the authorization of the correct owner of the listing.
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not authorized to make the changes");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

const Review=require("./Models/reviews.js");
module.exports.isReviewAuthor=async(req,res,next)=>{ // This middleware is for the authorization of the correct owner of the listing.
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not authorized to make the changes");
        return res.redirect(`/listings/${id}`);
    }
    next();
}