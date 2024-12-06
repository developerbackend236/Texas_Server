const mongoose  = require("mongoose");

const OrderSchema = new mongoose.Schema({
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        require: true,
    },
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Reference to the User model
        require: true,
    },
    OwnerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        require: true,
    },
    status:{
        type: String,
        enum: ['neworder', 'cancelled', 'delivered'],
        default: 'neworder'
    },
    grandTotal:{
        type: Number,
    },
    quantity:{
        type: Number,
    },
    price:{
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300, // Set expiration time for OTP (15 minutes)
    },
});

const Order = mongoose.model('Order', OrderSchema);

module.exports  =  Order;