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

//route for creating a new listing
app.get("/listings/new",asyncWrap(async (req,res)=>{
    res.render("listings/new.ejs");
}))


//route to view the listing in details
app.get("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    const ListingDetails=await Listing.findById(id);
    res.render("listings/show.ejs",{ListingDetails});
})

//route for posting the new listing
app.post("/listings",asyncWrap(async (req,res)=>{
    let result=listingSchema.validate(req.body);
    console.log(result);
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    // let newListing=req.body.listing; //object is returned in json format
    console.log(newListing);
    res.redirect("/listings")
}))

//route for editing the listings
app.get("/listings/:id/edit", async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})

//route for the updation
app.put("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing}); // deconstructing the data into sub parts
    res.redirect("/listings");
})

//route to delete the listing
app.delete("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    const deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})

let validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new expressError(400,errMsg);
    }
    else{
        next();
    }
}

//Post route for adding review
app.post("/listings/:id/reviews",validateReview,asyncWrap(async (req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("Review added");
    res.send("Review added");
}));

//route to show all the listings present
app.get("/listings",async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
})

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