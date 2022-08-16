const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description: {
        type: String,
    },
    image: String,
    
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
    }
})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;