const express = require('express');
const methodOverride = require('method-override')
const app = express();
const path = require('path');
const Joi = require('joi');     // DONE: Do the Joi checking 

//Database imports
const mongoose = require('mongoose');
const Product = require('./models/products');
const User = require('./models/user');

const wrapAsync = require('./utils/wrapAsync');
const ExpressError = require('./utils/ExpressError');
const { productSchema } = require('./schemas.js');

mongoose.connect('mongodb://localhost:27017/auctionSystem')
    .then(() => {
        console.log("Mongo CONNECTION OPEN");
    })
    .catch((err) => {
        console.log(`error ${err}`);
    })

// const firstProduct = [  // to check for the database 
//     {
//         name: "books",
//         startDate: new Date(),
//         endDate: new Date("2022-09-30"),
//         price: 200
//     },
//     {
//         name: "car",
//         startDate: new Date(),
//         endDate: new Date("2022-10-15"),
//         price: 6900
//     },
// ]
// Product.insertMany(firstProduct)
//     .then(res => {
//         console.log(res)
//     }).catch(e =>{
//         console.log(e)
//     })


//To parse form data in POST request body:
app.use(express.urlencoded({ extended: true }))

// To parse incoming JSON in POST request body:
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'))
app.set('views', path.join(__dirname, 'views'))

app.set('view engine', 'ejs')

/*          Note        DONE:
to get the remaining time left in an auction
use Date().time function which is in milliseconds to the end date
and then subtract it with the start time to get the remaining time.
*/

const validateProduct = (req, res, next) => {
    const { error } = productSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else {
        next();
    }
}

//Home page all the products  
app.get('/', wrapAsync(async (req, res) => {
    const products = await Product.find({})  //find all the products
    let date = new Date().getTime();

    //Check if the product is live, upcomming or previously done
    for (let product of products) {       //FIXME: This will change only when the user refreshes the webpage and not when the timer completes
        let startDate = stringDate(product.startDate, product.startTime);
        startDate = new Date(startDate).getTime();

        let endDate = stringDate(product.endDate, product.endTime);
        endDate = new Date(endDate).getTime();

        if (date < startDate && date < endDate) {
            if (product.isLive == false && product.isCompleted == false) {
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
            product.isLive = false;
            product.isCompleted = true;
        }
        await product.save();
    }

    res.render('home', { products })  // sending productInfo
}))

//Login page
app.get('/login', (req, res) => {

    res.render('login')
})

//Signup page
app.get('/signup', (req, res) => {

    res.render('signup')
})

app.post('/users', wrapAsync((req, res, next) => {
    const { username, email, password } = req.body;

    // console.log({username, email, password});
    // console.log(req.body)
    // res.send("It Workks " + req.body)
    res.redirect('/users');  // This gives a 302 status code 
}))
app.get('/users', (req, res) => {

    res.send('This is users get response')
})

//Creating a new product
app.get('/new', (req, res) => {
    const date = new Date();
    const fullDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    // console.log(fullDate);

    res.render('new', { fullDate });
})
//Getting data from the new product 
app.post('/',validateProduct, wrapAsync(async (req, res) => {  // TODO: Change / route to someting else

    const {product} = req.body;     //getting the product details from the body 

    //converting the start Date and time 
    let startDate = product.startDate;
    startDate = startDate.split("T");
    product.startTime = startDate[1];
    product.startDate = startDate[0];

    let endDate = product.endDate;
    endDate = endDate.split("T");
    product.endTime = endDate[1];
    product.endDate = endDate[0];

    const newProduct = new Product(product);
    await newProduct.save();

    res.redirect(`/`);
}))

//Getting the product details
app.get('/products/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id)
    res.render('product', { product })
}))
//Adding the value to product 
app.post('/products/:id', wrapAsync(async (req, res) => {       //TODO: Check if I can use simple javascript to submit the form without going to post and reloading 
    const { id } = req.params;

    const product = await Product.findById(id);

    if(req.body.bid < product.increment){  // increment price should not be less than minimum increment
        throw new ExpressError("Ammount too low", 406);  // not acceptable  
    }

    product.price += parseInt(req.body.bid)
    // console.log(product.price)

    await product.save();
    res.render('product', { product })
}))

// To start the server 
app.listen(5000, () => {
    console.log("LISTENING ON PORT 5000")
})

// To handle all the remaining path errors
app.all('*', (req, res, next) => {
    
    next(new ExpressError('Page not found', 404));
})

app.use((err, req, res, next) => {
    const {statusCode = 500, message = 'Something went wrong'}  = err;
    res.status(statusCode).send(message);
    // res.send("Something went wrong :(");
})

function stringDate(date, time) {
    let str = date.split("-");
    str = `${str[1]} ${str[2]}, ${str[0]} ${time}`;

    return str;
}