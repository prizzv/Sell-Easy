const User = require('../models/user');
const bcrypt = require('bcrypt');

// verifies the user data and logs in the user
const verifyUserLogin = async (req, res, next) => {
    const { email, password } = req.body;

    const foundUser = await User.findAndValidate(email, password);  // Done in user model 

    if (foundUser) {
        foundUser.lastLoginDate = new Date();
        await foundUser.save();

        req.session.user_id = foundUser._id;
        res.cookie('isLoggedin', 'true');

        req.session.isSeller = foundUser.isSeller;
        res.cookie('isSeller', foundUser.isSeller);

        res.redirect('/home');    // going to home page 
    } else {
        res.send("Invalid Username or Password");
    }
}

// creates a new user
const createNewUser = async (req, res, next) => {
    const { user, addresses } = req.body;

    const hash = await bcrypt.hash(user.password, 14);
    user.password = hash;
    user.addresses = addresses;
    const now = new Date();
    let age = new Date(user.birthDate).getFullYear();

    user.age = now.getFullYear() - age;
    user.firstLoginDate = now;
    user.lastLoginDate = now;
    user.isSeller = false;

    const newUser = new User(user);
    await newUser.save();

    // DONE: use cookies to store user data
    req.session.user_id = newUser._id;
    req.session.isSeller = newUser.isSeller;

    res.redirect('home');  // This gives a 302 status code 
}

// changes the password of the user
const changeUserPassword = async (req, res, next) => {

    const foundUser = await User.findAndChangePassword(req.session.user_id, req.body.user.password, req.body.user.newPassword1);  // Done in user model 

    if (foundUser) {

        await User.updateOne({ _id: req.session.user_id }, { password: foundUser.password });

    } else {
        res.send("Password");
    }

    res.redirect('user/details');
}

// logout the user
const logoutUser = (req, res) => {
    // req.session.user_id = null;          // I can just remove the user_id but the below method is better 
    req.session.destroy();
    res.redirect('/home');
}

module.exports = { verifyUserLogin, createNewUser, changeUserPassword, logoutUser };