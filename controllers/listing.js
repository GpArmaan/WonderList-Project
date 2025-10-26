const Listing=require("../Models/Listing.js");

module.exports.index=async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}

module.exports.view=async (req,res)=>{
    let {id}=req.params;
    const ListingDetails=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!id){
        req.flash("error","Listing Not Found");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{ListingDetails});
}

module.exports.getNew=async (req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.postNew=async (req,res)=>{
    // let result=listingSchema.validate(req.body);
    // console.log(result);
    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id; // We need to save the owner id whenever a new listing is being created   
    await newListing.save();
    // let newListing=req.body.listing; //object is returned in json format
    console.log(newListing);
    req.flash("success","New Listing created");
    res.redirect("/listings");
}

module.exports.getEdit=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}

module.exports.putEdit=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing}); // deconstructing the data into sub parts
    req.flash("success","Listing updated");
    res.redirect("/listings");
}

module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    const deletedListing=await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted");
    console.log(deletedListing);
    res.redirect("/listings");
}