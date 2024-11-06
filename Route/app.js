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


const companyImage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/companyimage');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Create multer upload instance
const uploadProduct = multer({ storage: productStorage });
const uploadCompanyImage = multer({ storage: companyImage });

// Auth Routes
app.post('/api/user/register', uploadCompanyImage.single('image'), AuthController.Register)
app.post('/api/user/login', AuthController.Login)
app.post('/api/user/forget-password', AuthController.ForgetPassword)
app.post('/api/user/forget-password-code-verify/:code/:id', AuthController.ForgetPasswordCodeVerify)
app.post('/api/user/change-forget-password', AuthController.ChangeForgetPassword)
app.post('/api/user/change-password', Auth, AuthController.ChangePassword)


app.post('/api/user/edit-profile',   uploadProduct.fields([
    { name: 'companyImage', maxCount: 1 }, 
    { name: 'profileImage', maxCount: 1 }
]), Auth, AuthController.EditProfile)


app.get('/api/user/get-my-products', Auth, AuthController.GetMyProducts)


// Product Routes
app.post('/api/user/add-product', Auth, uploadProduct.array('images',5), ProductController.AddProduct)
app.post('/api/user/GetAllProducts', Auth, ProductController.GetAllProducts)
app.post('/api/user/FilterProductByCategory',  ProductController.FilterProductByCategory)
app.get('/api/user/getAllCompanies',  ProductController.getAllCompanies)
app.post('/api/user/searchProducts',  ProductController.searchProducts)
app.get('/api/user/GetAllCatagores',  ProductController.GetAllCatagores)

//Rating api
app.post('/api/user/RateAProduct',  ProductController.RateAProduct)

// app.use('/uploads', express.static('uploads'));
app.use('/uploads', express.static('uploads'));
app.use('/uploads', express.static('companyimage'));



app.get('/',(req, res)=>{
    res.send({
        message:"runnig"
    })
})

// Bad Request
// app.use((req,res,next)=>{
//     res.status(200).json({
//         message : 'Bad request.'
//     })
// })




module.exports = app