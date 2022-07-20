const express = require('express');
const methodOverride = require('method-override')
const app = express();
const path = require('path');
const mysql = require('mysql');



//To parse form data in POST request body:
app.use(express.urlencoded({ extended: true }))  

// To parse incoming JSON in POST request body:
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'))
app.set('views', path.join(__dirname, 'views'))

app.set('view engine', 'ejs')


app.get('/', (req, res) => {

    res.render('home')
})


app.get('/login', (req, res) =>{

    res.render('login')
})

//Signup 
app.get('/signup', (req, res) =>{

    res.render('signup')
})

app.post('/users', (req, res) => {
    const {username, email, password} = req.body;

    console.log({username, email, password, id: uuid() });
    console.log(req.body)
    // res.send("It Workks " + req.body)
    res.redirect('/users');  // This gives a 302 status code 
})
app.get('/users',(req, res) => {

    res.send('This users is a get response')
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