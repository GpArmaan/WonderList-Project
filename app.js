if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}

const express=require("express");
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const listingRouter=require("./routes/listings.js")
const reviewRouter=require("./routes/reviews.js")
const userRouter=require("./routes/user.js")
const session=require("express-session");
const flash=require("connect-flash");
const User=require("./Models/user.js");
const passport=require("passport");
const LocalStrategy=require("passport-local"); // used for authentication strategies

const app=express();
const port=5000;

const MONGO_URL="mongodb://127.0.0.1:27017/WonderList";
main().then((res)=>{
    console.log("Connection Successfull");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/",(req,res)=>{
    res.send("Root Working");
})

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const sessionOptions={
    secret:"mysuppersecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000, // this will make the cookie validity to 1 week
        maxAge:7*24*60*60*1000,
        httpOnly: true //used to prevent from cross scripting attack.
    }
};

app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());// It will initialize the passport.
app.use(passport.session());//It will create a passport session so that if we open same site in new tab then it will come under same session and no need to login again
passport.use(new LocalStrategy(User.authenticate()));// It will implement the authentication strategies to the model

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser()); // It will store all the user info in the seesion
passport.deserializeUser(User.deserializeUser()); // It will remove all the user info in the seesion


//middleware for flash 
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user; // cretes a variable that can ber accessed in the ejs template.
    next();
})


// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"armaangupta@gmail.com",
//         username:"Armaan"
//     })
//     let registereduser=await User.register(fakeUser,"helloworld");
//     res.send(registereduser);
//     console.log(registereduser);
// })

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


// app.get("/testListing",async (req,res)=>{
//     let sampleTesting=new Listing({
//         title:"My new Villa",
//         description:"By the beach",
//         price:1500,
//         location:"Puri, Odisha",
//         country:"INDIA"
//     })
//     await sampleTesting.save();
//     console.log("Sample was saved");
//     res.send("Testing Success");
// })


//when a route which is not defined is called then it will pass on the status code and the message to the error handler middleware
app.all(/.*/,(req,res,next)=>{
    next(new expressError(404,"Page not found"));
});

//error handler middleware function to catch the error and show the error
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{message});
})


app.listen(port,()=>{
    console.log("Listening on port 5000");
})