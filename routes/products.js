const express = require('express');
const router = express.Router();

const { isSellerLogin, requireLogin } = require('../middleware/auth');
const { validateProduct } = require('../middleware/products');
const wrapAsync = require('../utils/wrapAsync');
const Product = require('../models/products');

const ProductsController = require('../controller/productsController');

//Getting the product details
router.get('/:id', wrapAsync(ProductsController.getProductDetails))

//Adding the value to product 
router.post('/:id', requireLogin, wrapAsync(ProductsController.addBidValue));

module.exports = router;