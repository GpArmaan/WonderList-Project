const express=require("express");
const router=express.Router();
const User=require("../Models/user.js");
const asyncWrap=require("../utils/asyncWrap.js");
const passport=require("passport");
const {saveRedirectUrl}=require("../middlewares.js");

const userControllers=require("../controllers/user.js");

router.get("/signup",userControllers.renderSignUp);

router.post("/signup", asyncWrap(userControllers.postSignUp));

router.get("/login",(req,res)=>{
    res.render("user/login.ejs");
});

router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userControllers.login)

router.get("/logout",userControllers.logout);

module.exports=router;