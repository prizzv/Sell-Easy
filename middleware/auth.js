const { userSchema } = require('../schemas.js');

const requireLogin = (req, res, next) => {
    if (!req.session.user_id) {
        res.cookie('isLoggedin', 'false');
        return res.redirect('/login')
    }

    res.cookie('isLoggedin', 'true');
    next();
}
const isSellerLogin = (req, res, next) => {
    if (!req.session.isSeller) {
        res.cookie('isSeller', 'false');
        return res.redirect('/login');
    } else {
        res.cookie('isSeller', 'true');
    }

    next();
}
const checkSellerLogin = (req, res, next) => {
    if (!req.session.isSeller) {
        res.cookie('isSeller', 'false');
    } else {
        res.cookie('isSeller', 'true');
    }

    next();
}

const checkLoggedin = (req, res, next) => {
    if (!req.session.user_id) {
        res.cookie('isLoggedin', 'false');
    } else {
        res.cookie('isLoggedin', 'true');
    }

    next();
}

const validateUser = (req, res, next) => {      //user schema validation check
    const { error } = userSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports = { requireLogin, isSellerLogin, checkLoggedin, checkSellerLogin, validateUser }