const pool = require("../config/db");

const {
  createProduct,
  getAllProducts,
  getFeaturedProducts,
  getLatestProducts,
  getProductsByCategory,
  searchProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getRelatedProducts,
} = require("../models/product.model");

/* ========== CREATE ========== */

const createProductController = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      image_url,
      category,
      is_featured
    } = req.body;

    const product = await createProduct(
      name,
      description,
      price,
      stock,
      image_url,
      category || "General",
      is_featured || false,
      req.user.id
    );

    res.status(201).json({ product });

  } catch (err) {
    console.error("Create product error:", err);
    res.status(500).json({ error: "Failed to create product" });
  }
};

/* ========== READ ========== */

const listProductsController = async (req, res) => {
  try {
    const products = await getAllProducts();
    res.json({ products });
  } catch {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

const featuredProductsController = async (req, res) => {
  try {
    const products = await getFeaturedProducts();
    res.json({ products });
  } catch {
    res.status(500).json({ error: "Failed to fetch featured products" });
  }
};

const latestProductsController = async (req, res) => {
  try {
    const products = await getLatestProducts();
    res.json({ products });
  } catch {
    res.status(500).json({ error: "Failed to fetch latest products" });
  }
};

const listByCategoryController = async (req, res) => {
  try {
    const products = await getProductsByCategory(req.params.category);
    res.json({ products });
  } catch {
    res.status(500).json({ error: "Failed to fetch category products" });
  }
};

const searchProductsController = async (req, res) => {
  try {
    const products = await searchProducts(req.query.q || "");
    res.json({ products });
  } catch {
    res.status(500).json({ error: "Search failed" });
  }
};

const getProductByIdController = async (req, res) => {
  const product = await getProductById(req.params.id);
  if (!product) return res.status(404).json({ error: "Not found" });
  res.json({ product });
};

/* ========== NEW: CATEGORIES API ========== */

const getCategoriesController = async (req, res) => {
  try {
    const result = await pool.query(`
  SELECT DISTINCT LOWER(TRIM(category)) AS category
  FROM products
  WHERE category IS NOT NULL
  ORDER BY category
`);

    res.json({ categories: result.rows.map(r => r.category) });

  } catch (err) {
    console.error("Categories error:", err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

/* ========== UPDATE / DELETE ========== */

const updateProductController = async (req, res) => {
  const product = await updateProduct(
    req.params.id,
    req.body.name,
    req.body.description,
    req.body.price,
    req.body.stock,
    req.body.image_url,
    req.body.category,
    req.body.is_featured
  );

  if (!product) return res.status(404).json({ error: "Not found" });
  res.json({ product });
};

const deleteProductController = async (req, res) => {
  const deleted = await deleteProduct(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Not found" });
  res.json({ message: "Deleted successfully" });
};

const relatedProductsController = async (req, res) => {
  try {
    const { category, id } = req.params;
    const products = await getRelatedProducts(category, id);
    res.json({ products });
  } catch (error) {
    console.error("Related products error:", error);
    res.status(500).json({ error: "Failed to load related products" });
  }
};

module.exports = {
  createProductController,
  listProductsController,
  featuredProductsController,
  latestProductsController,
  listByCategoryController,
  searchProductsController,
  getProductByIdController,
  getCategoriesController, // ✅ EXPORTED
  updateProductController,
  deleteProductController,
  relatedProductsController,
};
