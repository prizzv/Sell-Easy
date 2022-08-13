const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    lastLoginDate: {
        type: Date
    },
    firstLoginDate:{
        type: Date,
        required: true
    },
    productsOwned: {
        type: String
    },
    address:{
        type: String,
    },
    phoneNo: {
        type:Number,
        required: true
    }

})
const User = mongoose.model('User', userSchema);

module.exports = User;