const { Router } = require("express");
const {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProductById,
} = require("../controllers/product.controller");

const ProductRouter = Router();

ProductRouter.get("/", getAllProducts);

ProductRouter.get("/:id", getProductById);

ProductRouter.post("/", createProduct);

ProductRouter.delete("/:id", deleteProductById);

module.exports = {
  ProductRouter,
};
