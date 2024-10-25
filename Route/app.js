const express = require('express')
const app = express()
const db = require('./../Config/ConnectDb')
const cors = require('cors')
const bodyParser = require('body-parser')
const AuthController = require('./../Controllers/AuthController')
const ProductController = require('./../Controllers/ProductController')
const Auth = require('../Middleware/Auth_Middleware')
const multer = require('multer')
// const io = require('./acetech.js')
db()    

app.use(cors())
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json()) 

const productStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/products');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Create multer upload instance
const uploadProduct = multer({ storage: productStorage });

// Auth Routes
app.post('/api/user/register', AuthController.Register)
app.post('/api/user/login', AuthController.Login)
app.post('/api/user/forget-password', AuthController.ForgetPassword)
app.post('/api/user/forget-password-code-verify/:code/:id', AuthController.ForgetPasswordCodeVerify)
app.post('/api/user/change-forget-password', AuthController.ChangeForgetPassword)
app.post('/api/user/change-password', Auth, AuthController.ChangePassword)


app.get('/api/user/get-my-products', Auth, AuthController.GetMyProducts)

// Product Routes
app.post('/api/user/add-product', Auth, uploadProduct.array('images',5), ProductController.AddProduct)
app.get('/api/user/get-all-products', Auth, ProductController.GetAllProducts)

// app.use('/uploads', express.static('uploads'));

// Bad Request
app.use((req,res,next)=>{
    res.status(200).json({
        message : 'Bad request.'
    })
})

module.exports = app