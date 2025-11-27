const express = require("express");
const router = express.Router({ mergeParams: true });

const WrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const { reviewSchema } = require("../Schema.js");

const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

// IMPORT AUTH MIDDLEWARE
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");

const ReviewController = require("../Controllers/review.js");

// validation middleware
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(msg, 400);
  }
  next();
};


// POST REVIEW

router.post(
  "/", 
  isLoggedIn,
  validateReview, 
  WrapAsync(ReviewController.CreateReview)
);

// EDIT REVIEW FORM

router.get(
  "/:reviewId/edit", 
  isLoggedIn, 
  isReviewAuthor, 
  WrapAsync(ReviewController.EditReview)
);

// UPDATE REVIEW (PUT)

router.put(
  "/:reviewId", 
  isLoggedIn, 
  isReviewAuthor, 
  validateReview,
  WrapAsync(ReviewController.UpdateReview)
);

// DELETE REVIEW

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  WrapAsync(ReviewController.DeleteReview)
);


module.exports = router;
