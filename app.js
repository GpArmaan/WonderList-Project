const express=require("express");
const mongoose=require("mongoose");
const Listing=require("./Models/Listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");

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
app.get("/listings/new",async (req,res)=>{
    res.render("listings/new.ejs");
})


//route to view the listing in details
app.get("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    const ListingDetails=await Listing.findById(id);
    res.render("listings/show.ejs",{ListingDetails});
})

//route for posting the new listing
app.post("/listings",async (req,res)=>{
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    // let newListing=req.body.listing; //object is returned in json format
    console.log(newListing);
    res.redirect("/listings")
})

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

app.listen(port,()=>{
    console.log("Listening on port 5000");
})