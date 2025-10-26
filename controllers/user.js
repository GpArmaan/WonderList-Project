const User=require("../Models/user.js");

module.exports.renderSignUp=(req,res)=>{
    res.render("user/signup.ejs");
}

module.exports.postSignUp=async (req,res)=>{
    try{
        let {email,username,password}=req.body;
        let newUser=new User({email,username});
        let registeredUser=await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{   
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to WonderList");
            res.redirect("/listings");
        })   // It will make the user automatically login on the page when he/she signups
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup")
    }
}

module.exports.login=async(req,res)=>{
    req.flash("success","Welcome back to WonderList!")
    // console.log(req.user);
    
    if(res.locals.redirectUrl){
        res.redirect(res.locals.redirectUrl);
    }
    else{
        res.redirect("/listings");
    }
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Successfully logged out!");
        res.redirect("/listings");
    });
}