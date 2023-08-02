const { productSchema } = require('../schemas.js');
const ExpressError = require('../utils/ExpressError');

const validateProduct = (req, res, next) => {       //product schema validation check
    console.log(req.body.product);

    const { error } = productSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports = { validateProduct };