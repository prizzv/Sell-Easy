const express = require('express');
const router = express.Router();
const {requireLogin, checkSellerLogin} = require('../middleware/auth');
const UserController = require('../controller/userController');
const wrapAsync = require('../utils/wrapAsync');


//User details page
router.get('/details', requireLogin, checkSellerLogin, wrapAsync(UserController.userDetails));

module.exports = router;