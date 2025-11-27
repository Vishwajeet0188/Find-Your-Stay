const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.js");
const wrapAsync = require("../utils/WrapAsync.js");
const {savedRedirectUrl} = require("../middleware.js");
const UserController = require("../Controllers/user.js");
const { isLoggedIn } = require("../middleware");

// show signup form
router.get("/signup", UserController.RenderSignUpForm);


// handle signup form
router.post(
  "/signup",
  wrapAsync(UserController.SignUp)
);


// LOGIN : 

router.get("/login",UserController.RenderLogInForm);


router.post("/login",savedRedirectUrl,
  passport.authenticate("local",{failureRedirect: '/login',
  failureFlash: true}),
  UserController.LogIn
);



// LOGOUT : 

router.get("/logout",UserController.LogOut);

router.get("/wishlist", isLoggedIn, async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  res.render("users/wishlist.ejs", { wishlistItems: user.wishlist });
});

module.exports = router;
