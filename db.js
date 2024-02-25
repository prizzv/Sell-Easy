const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@nervespark.dckg2yk.mongodb.net/auctionSystem?retryWrites=true&w=majority`

mongoose.connect(`${uri}`)
    .then(() => {
        console.log("Mongo CONNECTION OPEN");
    })
    .catch((err) => {
        console.log(`error ${err}`);
    })


