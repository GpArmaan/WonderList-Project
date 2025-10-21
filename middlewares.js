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