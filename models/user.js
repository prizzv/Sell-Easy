const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required : true
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
    birthDate:{
        type: String,
        required : true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required : true,  
        enum: ['M', 'F']
    },
    addresses: [
        {
            // _id: { id: false },
            street: {type: String, required: true},
            city: {type: String, required: true},
            state: {type: String, required: true},
            country: {type: String, required: true},
            zipCode: {type: String, required: true},
            landmark: String
        }
    ],
    phoneNo: {
        type:Number,
        required: true
    },

    productsBought: [   //Products bought through an auction or standard site
        {       //Here there is an array of products
            type:Schema.Types.ObjectId,
            ref: 'Products'
        }
    ],


    //Seller schema stuff
    isSeller: Boolean,
    sellerDetails: {
        type:String,
    },
    productsOwned: [   //Products placed for selling
        {
            type: Schema.Types.ObjectId,
            ref: 'Products'
        }
    ]

})
const User = mongoose.model('User', userSchema);

module.exports = User;