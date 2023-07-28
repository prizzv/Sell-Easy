const express = require('express');
const router = express.Router();

const wrapAsync = require('../utils/wrapAsync');
const { checkLoggedin } = require('../middleware/auth');
const HomeController = require('../controller/homeController');

//Home page all the products  
router.get(['/', '/home'], checkLoggedin, wrapAsync(HomeController.homePage));


module.exports = router;