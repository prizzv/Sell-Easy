const mongoose = require('mongoose');


mongoose.connect('mongodb://0.0.0.0:27017/auctionSystem')
    .then(() => {
        console.log("Mongo CONNECTION OPEN");
    })
    .catch((err) => {
        console.log(`error ${err}`);
    })


