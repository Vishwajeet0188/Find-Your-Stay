const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const defaultImage =
  "https://images.unsplash.com/photo-1683024348191-cd7d004ae44c?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1173";

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    trim: true
  },

  image: {
  url: {
    type: String,
    default: defaultImage,
  },
  filename: String, // used later to delete/update image
},


  // ⭐ FIXED PRICE
  price: {
    type: Number,
    required: true
  },

  location: {
    type: String,
    trim: true
  },

  country: {
    type: String,
    trim: true
  },

  // ⭐ Reviews reference
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  category: {
    type: String,
    enum: [
      "trending",
      "rooms",
      "iconic-cities",
      "mountains",
      "pools",
      "castles",
      "camping",
      "farms",
      "snow",
      "historical",
      "beach",
      "family",
      "adventure",
      "environmental",
      "island",
      "desert",
      "jungle/safari",
      "treehouse"
    ],
    required: true
  }
});

listingSchema.set("toJSON", { virtuals: true });
listingSchema.set("toObject", { virtuals: true });

// ⭐ Add this BELOW listingSchema definition

listingSchema.virtual("averageRating").get(function () {
  if (!this.reviews || this.reviews.length === 0) {
    return null; // no reviews yet
  }

  // Calculate sum of all ratings
  const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);

  return (sum / this.reviews.length).toFixed(1); // e.g., "4.5"
});


module.exports = mongoose.model("Listing", listingSchema);
