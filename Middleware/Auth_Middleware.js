const jwt = require('jsonwebtoken')
const UserModal = require('../Models/UserModel')
const dotenv = require('dotenv').config()

var CheckUserAuth = async (req, res, next) => {
    let token

    const { authorization } = req.headers
    if (authorization && authorization.startsWith('Bearer')) {
        try {
            token = authorization.split(' ')[1]
            const DecodedToken = jwt.verify(token, process.env.TOKEN)
            const id = DecodedToken.id

            // Find The User by Id
            let UserDetails = await UserModal.findById(id)

            // Set The Password
            req.passwordKey = UserDetails.password

            // Convert the Mongoose document to a plain object
            const userObject = UserDetails.toObject();

            // Delete the password from the user object
            delete userObject.password;

            // Attach the user object (without password) to the req object
            req.user = userObject;
            
            if (!req.user) {
                return res.status(200).json({
                    success: false,
                    message: "User token isn't valid."
                })
            }
            next()
        } catch (error) {
            console.log("error")
            res.status(200).json({
                success: false,
                message: error.message
            })
        }
    }
    if (!token) {
        res.status(200).json({
            success: false,
            message: "Un Authorized Access"
        })
    }
}

module.exports = CheckUserAuth