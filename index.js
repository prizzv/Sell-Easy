const express = require('express');
const methodOverride = require('method-override')
const app = express();
const path = require('path');
const mongoose = require('mongoose');

const Product = require('./models/products');
const User = require('./models/user');


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

/*          Note
to get the remaining time left in an auction
use Date().time function which is in milliseconds to the end date
and then subtract it with the start time to get the remaining time.
*/

//Home page all the products            
app.get('/', async (req, res) => {
    const products = await Product.find({})  //find all the products
    let date = new Date().getTime();
    
    for(let product of products){
        let startDate = stringDate(product.startDate, product.startTime);
        startDate = new Date(startDate).getTime();
        
        let endDate = stringDate(product.endDate, product.endTime);
        endDate = new Date(endDate).getTime();
        //Check if the product is live, upcomming or previously done
        if(date < startDate && date < endDate){
            if(product.isLive == false && product.isCompleted == false){
                continue;
            }
            product.isLive = false;
            product.isCompleted = false;
        }else if(date > startDate && date < endDate){
            if(product.isLive == true && product.isCompleted == false){
                continue;
            }
            product.isLive = true;
            product.isCompleted = false;
        }else if(date > startDate && date > endDate){
            if(product.isLive == false && product.isCompleted == true){
                continue;
            }
            product.isLive = false;
            product.isCompleted = true;
        }
        await product.save();
    }
    
    res.render('home', {products})  // sending productInfo
})

//Login page
app.get('/login', (req, res) =>{

    res.render('login')
})

//Signup page
app.get('/signup', (req, res) =>{

    res.render('signup')
})

app.post('/users', (req, res) => {
    const {username, email, password} = req.body;

    console.log({username, email, password});
    console.log(req.body)
    // res.send("It Workks " + req.body)
    res.redirect('/users');  // This gives a 302 status code 
})
app.get('/users',(req, res) => {

    res.send('This is users get response')
})

//creating a new product
app.get('/new', (req, res) => {
    const date = new Date();
    const fullDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
    // console.log(fullDate);


    res.render('new', {fullDate});
})
//getting data from the new product 
app.post('/', async (req, res) => {  // change / route to someting else
    console.log(req.body);

    //converting the start Date and time 
    let startDate = req.body.startDate;
    startDate = startDate.split("T");
    req.body.startTime = startDate[1];
    req.body.startDate = startDate[0];
    
    let endDate = req.body.endDate;
    endDate = endDate.split("T");
    req.body.endTime = endDate[1];
    req.body.endDate = endDate[0];

    const newProduct = new Product(req.body);
    await newProduct.save();

    res.redirect(`/`);
})


// To start the server 
app.listen(5000, () => {
    console.log("LISTENING ON PORT 5000")
})

// To handle all the remaining paths
app.get('*', (req, res) => {  
    res.send("I dont know that path");
})
app.post('*', (req, res) => {
    res.send("Error in sending data.");
})

function stringDate(date, time) {
    let str = date.split("-");
    str = `${str[1]} ${str[2]}, ${str[0]} ${time}`;
    
    return str;
}