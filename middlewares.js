module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl; 
        req.flash("error","Login to proceed");
        return res.redirect("/login");
    }
    next();
} 

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

// This is a middleware funtion which checks whether the user is authenticated or not 
// if the user is not authenticated and wants to do some activity then he/she must login first

const Listing=require("./Models/Listing.js");
module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not authorized to make the changes");
        return res.redirect(`/listings/${id}`);
    }
    next();
}