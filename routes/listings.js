const express=require("express");
const router=express.Router();
const asyncWrap=require("../utils/asyncWrap.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const expressError=require("../utils/expressError.js");
const Listing=require("../Models/Listing.js");
const {isLoggedIn,isOwner}=require("../middlewares.js");

const listingController=require("../controllers/listing.js");

//route for creating a new listing
router.get("/new",isLoggedIn,asyncWrap(listingController.getNew));


//route to view the listing in details
router.get("/:id",listingController.view);

//route for posting the new listing
router.post("/",asyncWrap(listingController.postNew));

//route for editing the listings
router.get("/:id/edit",isLoggedIn,listingController.getEdit)

//route for the updation
router.put("/:id",isLoggedIn,isOwner,listingController.putEdit);

//route to delete the listing
router.delete("/:id",isLoggedIn,isOwner,listingController.destroyListing);

//route to show all the listings present
router.get("/",listingController.index);

module.exports=router;