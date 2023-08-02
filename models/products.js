const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description: {
        type: String,
    },
    image: {
        type: String
    },    //FIXME: fix the link string
    
    startDate:{
        type: String,
        required: true
    },
    endDate: {
        type: String,
        required: true
    },
    startTime:{
        type: String,
        // required: true
    },
    endTime:{
        type: String,
        // required: true
    },

    isLive: Boolean,
    isCompleted: Boolean,
    
    price: {
        type:Number,
        required: true
    },
    increment: {
        type: Number,
        required: true
    },
    shipping:{
        type: Number
    },
    category:{
        type: String,
        lowercase: true
    },
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    lastBid: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }
})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;