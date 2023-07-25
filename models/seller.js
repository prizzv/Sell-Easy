//TODO: create the seller schema 

const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const { Schema } = mongoose;

const sellerSchema = new Schema({
    sellerName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstLoginDate: {
        type: Date,
        required: true
    },

    addresses: [
        {
            // _id: { id: false },
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            country: { type: String, required: true },
            zipCode: { type: String, required: true },
            landmark: String
        }
    ],
    phoneNo: {
        type: Number,
        required: true
    },

    sellerDetails: {
        type: String,
    },

    productsOwned: [   //Products placed for selling
        {
            type: Schema.Types.ObjectId,
            ref: 'Products'
        }
    ],

    productsSold: [   //Previous products sold through the auction or standard site
        {       // Here there is an array of products
            type: Schema.Types.ObjectId,
            ref: 'Products'
        }
    ],
})

sellerSchema.statics.findAndValidate = async function (email, password) {

    try {
        const foundseller = await this.findOne({ email })
        const isValid = await bcrypt.compare(password, foundseller.password)

        if (!isValid) {
            throw new error;
        }
        return foundseller;

    } catch (error) {
        return false;
    }
}

//check the seller password and change the seller password
sellerSchema.statics.findAndChangePassword = async function (_id, password, newPassword) {
    try {
        //validating the seller
        const foundseller = await this.findOne({ _id });
        const isValid = await bcrypt.compare(password, foundseller.password)

        if (!isValid) {
            throw new error;
        }

        // since the seller password is valid changing the password
        const hash = await bcrypt.hash(newPassword, 14);
        foundseller.password = hash;

        return foundseller;

    } catch (error) {
        return false;
    }
}

const Seller = mongoose.model('Seller', sellerSchema);

module.exports = Seller;