const mongoose  = require("mongoose");

const OTPSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        require: true,
    },
    otpCode: {
        type: Number, // Assuming OTP is numeric
        require: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300, // Set expiration time for OTP (15 minutes)
    },
});

const OTP = mongoose.model('OTP', OTPSchema);

module.exports  =  OTP;
