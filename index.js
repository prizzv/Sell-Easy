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
const productsRoutes = require('./routes/products');
const sellerRoutes = require('./routes/seller');
const userRoutes = require('./routes/user');

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

app.use('/', authenticationRoutes);
app.use('/', homeRoutes);
app.use('/products',productsRoutes);
app.use('/seller', sellerRoutes);
app.use('/user', userRoutes);

// How the system works page 
app.get('/how_it_works', (req, res) => {

    res.render('how_it_works')
})

app.get('/seller_request', (req, res) => {

    res.render('seller_request');
})

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

