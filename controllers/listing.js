const Listing = require("../Models/Listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.view = async (req, res) => {
  let { id } = req.params;
  const ListingDetails = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!id) {
    req.flash("error", "Listing Not Found");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { ListingDetails });
};

module.exports.getNew = async (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.postNew = async (req, res) => {
  // let result=listingSchema.validate(req.body);
  // console.log(result);
  let response=await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send()
    console.log(response.body.features[0].geometry);

  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  console.log(req.user.id);
  newListing.owner = req.user.id; // We need to save the owner id whenever a new listing is being created
  newListing.image = { url, filename };
  newListing.geometry=response.body.features[0].geometry;
  await newListing.save();
  // let newListing=req.body.listing; //object is returned in json format
  console.log(newListing);
  req.flash("success", "New Listing created");
  res.redirect("/listings");
};

module.exports.getEdit = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  let OriginalImage = listing.image.url;
  OriginalImage = OriginalImage.replace("/upload", "/upload/h_300,w_250");
  res.render("listings/edit.ejs", { listing, OriginalImage });
};

module.exports.putEdit = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }); // deconstructing the data into sub parts
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing updated");
  res.redirect("/listings");
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted");
  console.log(deletedListing);
  res.redirect("/listings");
};
