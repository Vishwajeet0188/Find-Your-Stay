// for user authentication  : 

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;   // storing the url where user has gone earlier.
    req.flash("error", "You must looged in before creating listing!");
    return res.redirect("/login");
  }
  next();
}

// eak flow ko continue krne ke liye eak aur middleware banayeng jiska kaam hoga , jab bhi user agar add new listing pe click kre aur wo
// logged in nhi to usko login page se login krne ke baad direct add new listing wala page pr hi redirect krenge.


module.exports.savedRedirectUrl = (req,res,next) => {
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
    // local me save karane ka eak reson hai jo ki passport isko delete nhi kr skta in any case.
  }
  next();
}


const Listing = require("./models/listing");

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing Not Found!");
    return res.redirect("/listings");
  }

  // FIX → If listing has NO OWNER, prevent .equals() crash
  if (!listing.owner) {
    req.flash("error", "This listing has no owner assigned yet!");
    return res.redirect(`/listings/${id}`);
  }

  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "You are not allowed to do that!");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

const Review = require("./models/review");

module.exports.isReviewAuthor = async (req, res, next) => {
  const { reviewId } = req.params;
  const review = await Review.findById(reviewId);

  if (!review) {
    req.flash("error", "Review not found!");
    return res.redirect("back");
  }

  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You are not allowed to modify this review!");
    return res.redirect("back");
  }

  next();
};


module.exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    req.flash("error", "Access Denied! Admin Only.");
    return res.redirect("/listings");
  }
  next();
};
