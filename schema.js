const Joi = require('joi');

const listingSchema = Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().required().min(0),//ensures that the minimum price is not negative
        image:Joi.string().allow("",null) // It allows the empty url or null url because we have a default photo
    }).required(),
});

module.exports=listingSchema;

module.exports.reviewSchema=Joi.object({
    reviews:Joi.object({
        rating:Joi.number().required(),
        comments:Joi.string().required()
    }).required()
})