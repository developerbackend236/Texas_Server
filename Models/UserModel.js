const mongoose = require('mongoose');

const UserModal = mongoose.Schema({

    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: [true, "Email id already exists"],
    },
    password: {
        type: String,
        require: true
    },
    phone: {
        type: Number,
        require: true
    },
    UserProfile: {
        type: String,
        require: true
    },
    role: {
        type: String,
        required: true,
        enum: ["User", "Company"]
    }, 
    companyName: {
        type: String,
        required: true
    },
    companyImage:{
        type: String,
        required: true
    },
    companyDescription: {
        type: String
    },
    customerId:{
        type: String
    }
    

}, { timestamps: true })

const User = mongoose.model('User', UserModal);

module.exports = User;