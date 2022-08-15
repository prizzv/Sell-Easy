const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    
    image: String,
    
    startDate:{
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    isLive: Boolean,
    isCompleted: Boolean,
    price: {
        type:Number,
        required: true
    }
})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;