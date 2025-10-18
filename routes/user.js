const express=require("express");
const router=express.Router();
const User=require("../Models/user.js");
const asyncWrap=require("../utils/asyncWrap.js");
const passport=require("passport");

router.get("/signup",(req,res)=>{
    res.render("user/signup.ejs");
})

router.post("/signup", asyncWrap(async (req,res)=>{
    try{
        let {email,username,password}=req.body;
        let newUser=new User({email,username});
        let registeredUser=await User.register(newUser,password);
        console.log(registeredUser);
        req.flash("success","Welcome to WonderList");
        res.redirect("/listings");
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup")
    }
}));

router.get("/login",(req,res)=>{
    res.render("user/login.ejs");
});

router.post("/login",passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),async(req,res)=>{
    req.flash("success","Welcome back to WonderList!")
    res.redirect("/listings");
})

module.exports=router;