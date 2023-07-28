const User = require('../models/user');

const userDetails = async (req, res, next) => {
    const user = await User.findById(req.session.user_id);

    res.render('userDetails', { user })
}

module.exports = { userDetails };