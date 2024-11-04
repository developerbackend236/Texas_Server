const UserModel = require('../Models/UserModel')
const ProductModel = require('../Models/ProductModel')

class ProductController {

    static AddProduct = async (req, res) => {
        const { productTitle, productDescp, ProductPrice,productCategories } = req.body
        try {
            const UserId = req.user._id

            if(req.user.role === "Company"){
                const images = req.files.map(file => file.path);

                const newProductModel = new ProductModel({
                    userId: UserId,
                    productTitle: productTitle,
                    productDescp: productDescp,
                    productImage: images,
                    productPrice: ProductPrice,
                    productCategories: productCategories
                })
                await newProductModel.save()
    
                res.status(200).json({
                    success: true,
                    message: "Product add successfully."
                })
            }
            else{
                res.status(200).json({
                    success: false,
                    message: "You aren't eligible to upload this product."
                })
            }

        } catch (error) {
            res.status(200).json({
                success: false,
                message: error.message
            })
        }
    }

    static GetAllProducts = async (req, res) => {
        try {

            const {CompanyId} = req.body

            const GetAllProduct = await ProductModel.find({UserId:CompanyId})
            res.status(200).json({
                success: true,
                data: GetAllProduct,
                Product_Picture_Url: "https://khvw9wf1-3028.inc1.devtunnels.ms/"
            })
        } catch (error) {
            res.status(200).json({
                success: false,
                data: error.message
            })
        }
    }

    static getAllCompanies = async (req, res) => {


        try {
            const allCompanies = await UserModel.find()


            res.status(200).send({
                message:"success",
                baseUrl: "https://khvw9wf1-3028.inc1.devtunnels.ms/",
              allCompanies: allCompanies
            })
        } catch (error) {

            res.status(401).send({
                message:error,
            })
            console.log("error", error)
        }
    }

    static searchProducts = async (req, res) => {

        const {productTitle} = req.body

        try {
            const products = await ProductModel.find({
                productTitle: { $regex: productTitle, $options: 'i' } 
            });

            res.status(200).send({
                message: "Products",
                Products:products
            })
        } catch (error) {
            res.status(401).send({
                message: error.message,
            })
        }
    }

    




}

module.exports = ProductController