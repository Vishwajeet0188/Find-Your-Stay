// Controllers/listing.js
const Listing = require("../models/listing");

// 📌 INDEX – Show all listings with SEARCH + SORT
module.exports.index = async (req, res) => {
  const { search, sort } = req.query;  // <-- get search text
  let filter = {};
  let sortQuery = {};

  // 🔍 SEARCH – case-insensitive title match
  if (search && search.trim() !== "") {
    filter = { title: { $regex: search, $options: "i" } };
  }

  // ⬇ SORTING OPTIONS
  if (sort === "priceAsc") sortQuery = { price: 1 };
  if (sort === "priceDesc") sortQuery = { price: -1 };
  if (sort === "newest") sortQuery = { createdAt: -1 };

  // ⬇ FIND LISTINGS
  const allListings = await Listing.find(filter)
    .sort(sortQuery)
    .populate("owner")
    .populate("reviews");
  // 👀 send `search` back so UI retains it
  res.render("listings/index.ejs", { allListings, search });
};



// 📌 NEW FORM
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// 📌 SHOW LISTING
module.exports.ShowListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      options: { sort: { createdAt: -1 } },
      populate: { path: "author", select: "username _id" }
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing Not Found!");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

// 📌 CREATE LISTING
module.exports.CreateListing = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

// 📌 EDIT FORM
module.exports.EditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing Not Found!");
    return res.redirect("/listings");
  }

  res.render("listings/edit.ejs", { listing });
};

// 📌 UPDATE LISTING
module.exports.RenderUpdateForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found.");
    return res.redirect("/listings");
  }

  Object.assign(listing, req.body.listing);
  if (req.file) {
    listing.image = { url: req.file.path, filename: req.file.filename };
  }

  await listing.save();
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

// 📌 DELETE LISTING
module.exports.DeleteListing = async (req, res) => {
  const { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  if (!deletedListing) {
    req.flash("error", "Listing Not Found!");
    return res.redirect("/listings");
  }

  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};

// 📌 FILTER BY CATEGORY + SORT SUPPORT 🚀
module.exports.filterByCategory = async (req, res) => {
  const { category } = req.params;
  let sortQuery = {};

  if (req.query.sort === "priceAsc") sortQuery = { price: 1 };
  if (req.query.sort === "priceDesc") sortQuery = { price: -1 };
  if (req.query.sort === "newest")   sortQuery = { createdAt: -1 };

  const listings = await Listing.find({ category }).sort(sortQuery);

  if (listings.length === 0) {
    req.flash("error", `No listings found for "${category}".`);
    return res.redirect("/listings");
  }

  res.render("listings/category.ejs", { listings, category });
};
