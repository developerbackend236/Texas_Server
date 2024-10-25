const UserModel = require('../Models/UserModel')
const ProductModel = require('../Models/ProductModel')

class ProductController {

    static AddProduct = async (req, res) => {
        const { productTitle, productDescp } = req.body
        try {
            const UserId = req.user._id

            if(req.user.role === "Company"){
                const images = req.files.map(file => file.path);

                const newProductModel = new ProductModel({
                    userId: UserId,
                    productTitle: productTitle,
                    productDescp: productDescp,
                    productImage: images
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
            if(req.user.role === "Company"){
                return res.status(200).json({
                    success: false,
                    message: "You aren't eligible to see all products."
                })
            }

            const GetAllProduct = await ProductModel.find({})
            res.status(200).json({
                success: true,
                data: GetAllProduct
            })
        } catch (error) {
            res.status(200).json({
                success: false,
                data: error.message
            })
        }
    }
}

module.exports = ProductController