const { isValidObjectId } = require("mongoose");
const { ProductModel } = require("../schemas/product.schema");

const getAllProducts = async (req, res, next) => {
  try {
    const products = await ProductModel.find();
    console.log(products);

    return res.status(200).json({ products });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        message: "id is required",
        success: false,
      });
    }
    const isValidId = isValidObjectId(id);
    if (!isValidId) {
      return res.status(400).json({
        message: "id is invalid",
        success: false,
      });
    }
    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }

    return res.status(200).json({
      product,
      message: "product fetched by Id",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const body = req.body;
    const { name, price, quantity } = body;

    if (!name) {
      return res.status(400).json({
        message: "Missing required params - Name",
        success: false,
      });
    }

    if (!price) {
      return res.status(400).json({
        message: "Missing required params - price",
        success: false,
      });
    }

    if (!quantity) {
      return res.status(400).json({
        message: "Missing required params - quantity",
        success: false,
      });
    }

    const product = await ProductModel.create({
      name,
      price,
      quantity,
    });

    await product.save();

    return res.status(201).json({
      product,
      message: "product added successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProductById = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        message: "id is required",
        success: false,
      });
    }
    const isValidId = isValidObjectId(id);
    if (!isValidId) {
      return res.status(400).json({
        message: "id is invalid",
        success: false,
      });
    }

    const deletedProduct = await ProductModel.findByIdAndDelete(id);

    return res.status(200).json({
      deleted: true,
      product: deletedProduct,
      message: "product deleted successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProductById,
};
