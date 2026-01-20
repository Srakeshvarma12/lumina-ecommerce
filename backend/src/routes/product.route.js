const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middlewares/auth.middleware");

const {
  createProductController,
  listProductsController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
  featuredProductsController,
  latestProductsController,
  listByCategoryController,
  searchProductsController,
  relatedProductsController,
  getCategoriesController,
} = require("../controllers/product.controller");

/* ===================== PUBLIC ===================== */

router.get("/", listProductsController);
router.get("/featured", featuredProductsController);
router.get("/latest", latestProductsController);
router.get("/search", searchProductsController);
router.get("/categories", getCategoriesController);
router.get("/category/:category", listByCategoryController);
router.get("/related/:category/:id", relatedProductsController);
router.get("/:id", getProductByIdController);

/* ===================== ADMIN ===================== */

router.post("/", protect, adminOnly, createProductController);
router.put("/:id", protect, adminOnly, updateProductController);
router.delete("/:id", protect, adminOnly, deleteProductController);

module.exports = router;
