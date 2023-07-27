const express = require('express');
const methodOverride = require('method-override')
const app = express();
const path = require('path');
const Joi = require('joi');     // DONE: Do the Joi checking 
const bcrypt = require('bcrypt');
const session = require('express-session')
const cookieParser = require('cookie-parser');

//Database imports
const Product = require('./models/products');
const User = require('./models/user');
const connection = require('./db.js');

const wrapAsync = require('./utils/wrapAsync');
const ExpressError = require('./utils/ExpressError');
const { productSchema, userSchema } = require('./schemas.js');
const { isSellerLogin, requireLogin, checkSellerLogin, checkLoggedin } = require('./middleware/auth');

// Routes imports
const authenticationRoutes = require('./routes/authentication');
const homeRoutes = require('./routes/home');

//To parse form data in POST request body:
app.use(express.urlencoded({ extended: true }))

// To parse incoming JSON in POST request body:
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'))
app.set('views', path.join(__dirname, 'views'))

app.use(session({
    secret: 'notagoodsecret',
    resave: false,
    saveUninitialized: true
}))

app.use(cookieParser('asecret'))        // to use signing we use the secret inside the cookieParser

app.set('view engine', 'ejs')

/*          Note        DONE:
to get the remaining time left in an auction
use Date().time function which is in milliseconds to the end date
and then subtract it with the start time to get the remaining time.
*/

const validateProduct = (req, res, next) => {       //product schema validation check
    const { error } = productSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


app.use('/', authenticationRoutes);
app.use('/', homeRoutes);


//Creating a new product
app.get('/new', isSellerLogin, (req, res) => {

    res.render('new');
})
//Getting data from the new product 
app.post('/product', validateProduct, wrapAsync(async (req, res) => {  // DONE: Change / route to someting else. Post of a new product

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

//Getting the product details
app.get('/products/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id)
    res.render('product', { product })
}))
//Adding the value to product 
app.post('/products/:id', requireLogin, wrapAsync(async (req, res, next) => {       //TODO: Check if I can use simple javascript to submit the form without going to post and reloading 
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
}))

// How the system works page 
app.get('/how_it_works', (req, res) => {

    res.render('how_it_works')
})

app.get('/seller_request', (req, res) => {

    res.render('seller_request');
})

//User details page
app.get('/userDetails', requireLogin, checkSellerLogin, wrapAsync(async (req, res, next) => {
    const user = await User.findById(req.session.user_id);

    res.render('userDetails', { user })
}))

app.get('/secret', (req, res) => {       // FIXME: Useless delete later 
    if (!req.session.user_id) {
        return res.redirect('/login')
    }
    res.send("HUSHHHHHHHHHHHHHH");
})

// To start the server 
app.listen(5000, () => {
    console.log("LISTENING ON PORT 5000")
})

// To handle all the remaining path errors
app.all('*', (req, res, next) => {

    next(new ExpressError('Page not found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err;
    res.status(statusCode).send(message);
    // res.send("Something went wrong :(");
})

