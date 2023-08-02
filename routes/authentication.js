const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const { validateUser, checkLoggedin } = require('../middleware/auth');
const AuthenticationController = require('../controller/authenticationController');
const User = require('../models/user');

//Login page
router.get('/login', (req, res) => {

    res.render('authentication/login');
});

router.post('/login', wrapAsync(AuthenticationController.verifyUserLogin));

router.post('/logout', AuthenticationController.logoutUser);
//Signup page
router.get('/signup', (req, res) => {

    res.render('authentication/signup');
});

router.post('/signup', validateUser, wrapAsync(AuthenticationController.createNewUser));
router.patch('/signup', async (req, res, next) => {
    const foundUser = await User.findByIdAndUpdate(req.session.user_id, { addresses: req.body.newAddress });

    res.redirect('user/details');
});

router.patch('/changePassword', AuthenticationController.changeUserPassword);

module.exports = router;