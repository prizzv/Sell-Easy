const mongoose = require('mongoose');

const product = new mongoose.Schema({
    prodName:{
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
    isOpen: Boolean,
    price: {
        type:Number,
        required: true
    }
})