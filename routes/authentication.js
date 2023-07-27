const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const { validateUser, checkLoggedin } = require('../middleware/auth');
const AuthenticationController = require('../controller/authenticationController');

//Login page
router.get('/login', (req, res) => {

    res.render('authentication/login');
})

router.post('/login', wrapAsync(AuthenticationController.verifyUserLogin))

router.post('/logout', (req, res) => {         // TODO: use this somewhere on user details page 
    // req.session.user_id = null;          // I can just remove the user_id but the below method is better 
    req.session.destroy();
    res.redirect('/home');
})
//Signup page
router.get('/signup', (req, res) => {

    res.render('authentication/signup')
})

router.post('/signup', validateUser, wrapAsync(AuthenticationController.createNewUser))
router.patch('/signup', async (req, res, next) => {
    const foundUser = await User.findByIdAndUpdate(req.session.user_id, { addresses: req.body.newAddress });

    // console.log(foundUser);

    res.redirect('userDetails');
})

router.patch('/changePassword', async (req, res, next) => {

    const foundUser = await User.findAndChangePassword(req.session.user_id, req.body.user.password, req.body.user.newPassword1);  // Done in user model 

    if (foundUser) {

        await User.updateOne({ _id: req.session.user_id }, { password: foundUser.password });

    } else {
        res.send("Password");
    }

    res.redirect('userDetails');
})

router.get('/users', (req, res) => {

    res.send('This is users get response')
})

module.exports = router;