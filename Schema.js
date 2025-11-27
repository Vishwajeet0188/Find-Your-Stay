const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().min(0).required(),
        location: Joi.string().required(),
        country: Joi.string().required(),

        // 👇 FIX THIS SO MULTER IMAGE DOESN'T CRASH UPDATE
        image: Joi.any(),    

        category: Joi.string().valid(
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
            "jungle-safari",
            "treehouse"
        ).required()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required(),
        comment: Joi.string().required(),
    }).required(),
});


module.exports.userSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.string().valid("user", "admin").default("user")
});