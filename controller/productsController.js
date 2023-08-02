const Product = require('../models/products');

// get the details of specific product.
const getProductDetails = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id)
    res.render('product', { product })
};


const addBidValue = async (req, res) => {       //TODO: Check if I can use simple javascript to submit the form without going to post and reloading 
    const { id } = req.params;

    const product = await Product.findById(id);

    product.lastBid = req.session.user_id;   // Adds the current userID to the products lastBid 

    if (req.body.bid < product.increment) {  // increment price should not be less than minimum increment
        throw new ExpressError("Ammount too low", 406);  // not acceptable  
    }

    product.price += parseInt(req.body.bid)
    // console.log(product.price)

    await product.save();
    res.render('product', { product })
}


module.exports = { getProductDetails, addBidValue }