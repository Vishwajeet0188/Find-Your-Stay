const Listing = require("../models/listing");
const Review = require("../models/review");
const ExpressError = require("../utils/ExpressError");

// CREATE REVIEW
module.exports.CreateReview = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError("Listing not found!", 404);
    }

    const review = new Review(req.body.review);
    review.author = req.user._id;

    listing.reviews.push(review);

    await review.save();
    await listing.save();

    req.flash("success", "Review Added!");
    res.redirect(`/listings/${id}`);
};

// EDIT REVIEW
module.exports.EditReview = async (req, res) => {
    const { id, reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
        req.flash("error", "Review Not Found!");
        return res.redirect(`/listings/${id}`);
    }

    res.render("reviews/edit.ejs", { listingId: id, review });
};

// UPDATE REVIEW
module.exports.UpdateReview = async (req, res) => {
    const { id, reviewId } = req.params;

    await Review.findByIdAndUpdate(reviewId, req.body.review);

    req.flash("success", "Review Updated!");
    res.redirect(`/listings/${id}`);
};

// DELETE REVIEW
module.exports.DeleteReview = async (req, res) => {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review deleted!");
    res.redirect(`/listings/${id}`);
};
