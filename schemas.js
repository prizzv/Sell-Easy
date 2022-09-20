const Joi = require('joi');

module.exports.productSchema = Joi.object({
    product : Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required(),
        shipping: Joi.number().required(),
        increment: Joi.number().required(),
        deliver: Joi.string().required(),
        startDate: Joi.string().required(),
        endDate: Joi.string().required(),
    }).required()
});

