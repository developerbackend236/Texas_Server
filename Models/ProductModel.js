const mongoose = require('mongoose');

const ProductModal = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    productTitle: {
        type: String,
        required: true,
    },
    productDescp: {
        type: String,
        required: true
    },
    productImage: {
        type: Array,
        // require: true
    },
    productPrice:{
        type: String,
    },
    productCategories: { 
        type: String,  
    },
    AvaRating:{
        default: 0,
        type: Number,
    },
    TotalNumberOfRating:{
        default: 0,
        type: Number,
    }

}, { timestamps: true })

const Product = mongoose.model('Product', ProductModal);

module.exports = Product;