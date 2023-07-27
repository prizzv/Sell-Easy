const express = require('express');
const router = express.Router();

const Product = require('../models/products');
const wrapAsync = require('../utils/wrapAsync');
const { checkLoggedin } = require('../middleware/auth');
const { stringDate } = require('../utils/homeUtils');

//Home page all the products  
router.get(['/', '/home'], checkLoggedin, wrapAsync(async (req, res) => {
    const products = await Product.find({})  //find all the products
    let date = new Date().getTime();

    //Check if the product is live, upcomming or previously done
    for (let product of products) {       //FIXME: This will change only when the user refreshes the webpage and not when the timer completes
        let startDate = stringDate(product.startDate, product.startTime);
        startDate = new Date(startDate).getTime();

        let endDate = stringDate(product.endDate, product.endTime);
        endDate = new Date(endDate).getTime();

        if (date < startDate && date < endDate) {
            if (product.isLive == false && product.isCompleted == false) {      //If already all correct then continue else correct them 
                continue;
            }
            product.isLive = false;
            product.isCompleted = false;
        } else if (date > startDate && date < endDate) {
            if (product.isLive == true && product.isCompleted == false) {
                continue;
            }
            product.isLive = true;
            product.isCompleted = false;
        } else if (date > startDate && date > endDate) {
            if (product.isLive == false && product.isCompleted == true) {
                continue;
            }
            if (product.lastBid) {        // if someone has bid on the product last time only then do following
                const user = await User.findById(product.lastBid);    //find the user and update the user with the product since he has won the product 
                user.productsBought = product;
                await user.save();
            }
            product.isLive = false;
            product.isCompleted = true;
        }
        await product.save();   // this will run only if all the above continue conditions fails
    }

    res.render('home', { products })  // sending productInfo
}))


module.exports = router;