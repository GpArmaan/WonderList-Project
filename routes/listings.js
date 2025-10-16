const express=require("express");
const router=express.Router();
const asyncWrap=require("../utils/asyncWrap.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const expressError=require("../utils/expressError.js");
const Listing=require("../Models/Listing.js");

//route for creating a new listing
router.get("/new",asyncWrap(async (req,res)=>{
    res.render("listings/new.ejs");
}))


//route to view the listing in details
router.get("/:id",async (req,res)=>{
    let {id}=req.params;
    const ListingDetails=await Listing.findById(id).populate("reviews");
    if(!id){
        req.flash("error","Listing Not Found");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{ListingDetails});
})

//route for posting the new listing
router.post("/",asyncWrap(async (req,res)=>{
    // let result=listingSchema.validate(req.body);
    // console.log(result);
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    // let newListing=req.body.listing; //object is returned in json format
    console.log(newListing);
    req.flash("success","New Listing created");
    res.redirect("/listings");
}));

//route for editing the listings
router.get("/:id/edit", async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})

//route for the updation
router.put("/:id",async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing}); // deconstructing the data into sub parts
    req.flash("success","Listing updated");
    res.redirect("/listings");
})

//route to delete the listing
router.delete("/:id",async (req,res)=>{
    let {id}=req.params;
    const deletedListing=await Listing.findByIdAndDelete(id);
    req.flash("success","Listin deleted");
    console.log(deletedListing);
    res.redirect("/listings");
})

//route to show all the listings present
router.get("/",async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
})

module.exports=router;