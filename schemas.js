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

module.exports.userSchema = Joi.object({
    user : Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        username: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{7,30}$')).required(),
        password2: Joi.string(),
        gender: Joi.string().required(),    // TODO: use enum here to check 
        birthDate: Joi.string().required(),
        phoneNo: Joi.number().min(1000000000).max(9999999999).required(),

    }).required(),

    addresses: Joi.object({
        city: Joi.string().required(),
        street: Joi.string().required(),
        state: Joi.string().required(),
        country: Joi.string().required(),
        landmark: Joi.string(),
        zipCode: Joi.number().min(100000).max(999999).required(),
    }).required()
});

