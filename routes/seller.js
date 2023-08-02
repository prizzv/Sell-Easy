const express = require('express');
const router = express.Router();
const { isSellerLogin } = require('../middleware/auth');
const { validateProduct } = require('../middleware/products');
const wrapAsync = require('../utils/wrapAsync');
const upload = require('../middleware/imageUpload');

const SellerController = require('../controller/sellerController');
//Creating a new product
router.get('/newProduct', isSellerLogin, (req, res) => {

    res.render('new');
})
//Getting data from the new product and storing it in the database
router.post('/newProduct', upload.single('product_image'), validateProduct, wrapAsync(SellerController.createProduct));

module.exports = router;