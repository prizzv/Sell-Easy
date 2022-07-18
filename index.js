const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))

app.get('/', (req, res) => {
    res.render('home')
})


app.get('/login', (req, res) =>{

    res.render('login')
})

app.get('/signup', (req, res) =>{

    res.render('signup')
})

// To start the server 
app.listen(3000, () => {
    console.log("LISTENING ON PORT 3000")
})