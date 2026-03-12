const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string()
      .required()
      .min(3)
      .max(100),

    description: Joi.string()
      .required()
      .min(1),

    price: Joi.number()
      .required()
      .min(0),

    location: Joi.string()
      .required(),

    country: Joi.string()
      .required(),
   }).required()  
});


module.exports.reviewSchema = Joi.object({
  reviews: Joi.object({
    
    rating: Joi.number()
      .required()
      .min(0)
      .max(5),

    Comment: Joi.string()
      .required()
      .min(2)
      .max(500),

    createdAt: Joi.date()
      .optional()

  }).required()
});