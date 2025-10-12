const express=require("express");
const mongoose=require("mongoose");
const Listing=require("./Models/Listing.js");
const Review=require("./Models/reviews.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const asyncWrap=require("./utils/asyncWrap.js");
const expressError=require("./utils/expressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const listing=require("./routes/listings.js")
const review=require("./routes/reviews.js")

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


app.use("/listings",listing);
app.use("/listings/:id/reviews",review);


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