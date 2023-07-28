const express = require('express');
const router = express.Router();
const { isSellerLogin } = require('../middleware/auth');
const { validateProduct } = require('../middleware/products');
const wrapAsync = require('../utils/wrapAsync');
const User = require('../models/user');
const Product = require('../models/products');

//Creating a new product
router.get('/new', isSellerLogin, (req, res) => {

    res.render('new');
})
//Getting data from the new product and storing it in the database
router.post('/newProduct', isSellerLogin, validateProduct, wrapAsync(async (req, res) => {

    const { product } = req.body;     //getting the product details from the body 
    const seller = await User.findById(req.session.user_id);

    //converting the start Date and time 
    let startDate = product.startDate;
    startDate = startDate.split("T");
    product.startTime = startDate[1];
    product.startDate = startDate[0];

    let endDate = product.endDate;
    endDate = endDate.split("T");
    product.endTime = endDate[1];
    product.endDate = endDate[0];

    product.seller = seller._id;
    const newProduct = new Product(product);
    await newProduct.save();

    seller.productsOwnedList = newProduct;
    await seller.save();

    res.redirect(`/`);
}))

module.exports = router;