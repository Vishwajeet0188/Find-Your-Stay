const express = require("express");
const router = express.Router();
const { isLoggedIn, isAdmin } = require("../middleware");
const Listing = require("../models/listing");
const User = require("../models/user");

// ADMIN DASHBOARD
router.get("/dashboard", isLoggedIn, isAdmin, async (req, res) => {
  const users = await User.find({});
  const listings = await Listing.find({}).populate("owner", "username email");
  res.render("admin/dashboard.ejs", { users, listings });
});

module.exports = router;
