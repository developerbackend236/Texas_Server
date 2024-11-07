const UserModel = require("../Models/UserModel");
const ProductModel = require("../Models/ProductModel");

class ProductController {
  static AddProduct = async (req, res) => {
    const { productTitle, productDescp, ProductPrice, productCategories } =
      req.body;
    try {
      const UserId = req.user._id;

      if (req.user.role === "Company") {
        const images = req.files.map((file) => file.path);

        const newProductModel = new ProductModel({
          userId: UserId,
          productTitle: productTitle,
          productDescp: productDescp,
          productImage: images,
          productPrice: ProductPrice,
          productCategories: productCategories,
        });
        await newProductModel.save();

        res.status(200).json({
          success: true,
          message: "Product add successfully.",
        });
      } else {
        res.status(200).json({
          success: false,
          message: "You aren't eligible to upload this product.",
        });
      }
    } catch (error) {
      res.status(200).json({
        success: false,
        message: error.message,
      });
    }
  };

  static GetAllProducts = async (req, res) => {
    try {
      const { CompanyId } = req.body;

      const GetAllProduct = await ProductModel.find({ UserId: CompanyId });
      res.status(200).json({
        success: true,
        data: GetAllProduct,
        Product_Picture_Url: "https://khvw9wf1-3028.inc1.devtunnels.ms/",
      });
    } catch (error) {
      res.status(200).json({
        success: false,
        data: error.message,
      });
    }
  };

  static getAllCompanies = async (req, res) => {
    try {
      const allCompanies = await UserModel.find();

      res.status(200).send({
        message: "success",
        baseUrl: "https://khvw9wf1-3028.inc1.devtunnels.ms/",
        allCompanies: allCompanies,
      });
    } catch (error) {
      res.status(401).send({
        message: error,
      });
      console.log("error", error);
    }
  };

  static searchProducts = async (req, res) => {
    const { productTitle } = req.body;

    try {
      const products = await ProductModel.find({
        productTitle: { $regex: productTitle, $options: "i" },
      });

      res.status(200).send({
        message: "Products",
        Products: products,
      });
    } catch (error) {
      res.status(401).send({
        message: error.message,
      });
    }
  };

  static RateAProduct = async (req, res) => {
    try {
      const { productID, stars } = req.body;

      const product = await ProductModel.findOne({ _id: productID });
      if (!product) {
        return res.status(404).send({ message: "Product not found" });
      }

      console.log("product", product);

      product.TotalNumberOfRating += 1;

      product.AvaRating += JSON.parse(stars);

      const averageRating = product.AvaRating / product.TotalNumberOfRating;

      await product.save();

      res.send({
        message: "Rating added successfully",
        totalRatings: product.TotalNumberOfRating,
        averageRating: averageRating.toFixed(2), // rounding to 2 decimal places
        product: product,
      });
    } catch (error) {
      res
        .status(500)
        .send({ message: "Error rating product", error: error.message });
    }
  };

  static GetAllCatagores = async (req, res) => {
    const category = [
      "Nuts",
      "Bolts",
      "Washers",
      "Virgin plastics",
      "Re-grind plastics",
      "Sheet steels",
      "Coil materials",
      "Wire materials",
      "Tools",
      "Specialty",
      "Molded parts",
      "Custom metal parts",
    ];

    res.status(200).send({
      message: "all catagories",
      data: category,
    });
  };

  static FilterProductByCategory = async (req, res) => {
    const { catagoryName } = req.body;
    console.log("catagoryName", catagoryName);
    try {
      const allCategoizeProduct = await ProductModel.find({
        productCategories: catagoryName,
      });

      console.log("allCategoizeProduct", allCategoizeProduct);
      if (allCategoizeProduct) {
        res.status(200).send({
          message: "All Products",
          Products: allCategoizeProduct,
        });
      } else {
        res.status(200).send({
          message: "No Product found",
        });
      }
    } catch (error) {
      res.status(401).send({
        error: error,
      });
    }
  };

  static editProduct = async (req, res) => {
    const {
      productTitle,
      productDescp,
      ProductPrice,
      productCategories,
      productID,
    } = req.body;

    try {
      const getProductById = await ProductModel.findOne({ _id: productID });

      if (getProductById) {
        if (productTitle) {
          getProductById.productTitle = productTitle;
        }

        if (productDescp) {
          getProductById.productDescp = productDescp;
        }
        if (ProductPrice) {
          getProductById.productPrice = ProductPrice;
        }
        if (productCategories) {
          getProductById.productCategories = productCategories;
        }

        await getProductById.save();

        res.send({
          success: true,
          getProductById,
        });
      } else {
        res.status(201).send({
          success: false,
          message: "no product found",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  static deleteProduct = async (req, res) => {
    const { productId } = req.body;
    const userId = req.user._id;

    const findProduct = await ProductModel.findOne({ _id: productId });

    if (findProduct) {
      if (findProduct.userId.equals(userId)) {
        const DeleteProduct = await ProductModel.findByIdAndDelete(productId);

        // Check if the product was found and deleted
        if (!DeleteProduct) {
          return res.status(404).json({
            success: false,
            message: "Product not found",
          });
        }

        // Respond with a success message if deletion was successful
        res.status(200).json({
          success: true,
          message: "Product deleted successfully",
          DeleteProduct, // Optional: Return the deleted product details
        });
      } else {
        res.status(500).json({
          success: false,
          message: "your not the owner of this product",
        });
      }
    } else {
      res.status(500).json({
        success: false,
        message: "Product not found",
      });
    }
  };
}

module.exports = ProductController;
