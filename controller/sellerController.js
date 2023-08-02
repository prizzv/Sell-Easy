const User = require("../models/user");
const Product = require("../models/products");

const createProduct = async (req, res) => {
    // const { name, description, startDate, endDate, price, increment, shipping, category, seller } = req.body;
    // const product = { name, description, startDate, endDate, price, increment, shipping, category, seller }

    const { product } = req.body;     //getting the product details from the body 
    const seller = await User.findById(req.session.user_id);
    // console.log(req.file);
    // console.log({ product });

    if (req.file) {
        const image = req.file.filename;
        product.image = image;
    }
    delete product.product_image;

    // converting the start Date and time 
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

    seller.productsOwned.push(newProduct);
    await seller.save();

    res.redirect(`/`);
}

module.exports = { createProduct };
