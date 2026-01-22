const pool = require("../config/db");

/* ==============================
   ➕ CREATE PRODUCT
================================ */

const createProductController = async (req, res) => {
  try {
    const { name, description, price, stock, image_url, category, is_featured } = req.body;

    const result = await pool.query(
      `INSERT INTO products 
       (name, description, price, stock, image_url, category, is_featured, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING *`,
      [
        name,
        description || null,
        price,
        stock,
        image_url || null,
        category || null,
        is_featured || false,
        req.user.id
      ]
    );

    res.status(201).json({ product: result.rows[0] });

  } catch (err) {
    console.error("Create product error:", err);
    res.status(500).json({ error: "Failed to create product" });
  }
};


/* ==============================
   📦 GET ALL PRODUCTS
================================ */

const listProductsController = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM products
      ORDER BY created_at DESC
    `);

    res.json({ products: result.rows });

  } catch (err) {
    console.error("List products error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};


/* ==============================
   ⭐ FEATURED PRODUCTS
================================ */

const featuredProductsController = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM products
      WHERE is_featured = true
      ORDER BY created_at DESC
    `);

    res.json({ products: result.rows });

  } catch (err) {
    console.error("Featured error:", err);
    res.status(500).json({ error: "Failed to fetch featured products" });
  }
};


/* ==============================
   🆕 LATEST PRODUCTS
================================ */

const latestProductsController = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM products
      ORDER BY created_at DESC
      LIMIT 8
    `);

    res.json({ products: result.rows });

  } catch (err) {
    console.error("Latest error:", err);
    res.status(500).json({ error: "Failed to fetch latest products" });
  }
};


/* ==============================
   🗂️ PRODUCTS BY CATEGORY
================================ */

const listByCategoryController = async (req, res) => {
  try {
    const { category } = req.params;

    const result = await pool.query(`
      SELECT *
      FROM products
      WHERE category = $1
      ORDER BY created_at DESC
    `, [category]);

    res.json({ products: result.rows });

  } catch (err) {
    console.error("Category error:", err);
    res.status(500).json({ error: "Failed to fetch category products" });
  }
};


/* ==============================
   🔎 SEARCH PRODUCTS
================================ */

const searchProductsController = async (req, res) => {
  try {
    const q = req.query.q || "";

    const result = await pool.query(`
      SELECT *
      FROM products
      WHERE name ILIKE $1 OR description ILIKE $1
      ORDER BY created_at DESC
    `, [`%${q}%`]);

    res.json({ products: result.rows });

  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Search failed" });
  }
};


/* ==============================
   📄 SINGLE PRODUCT
================================ */

const getProductByIdController = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM products
      WHERE id = $1
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json({ product: result.rows[0] });

  } catch (err) {
    console.error("Single product error:", err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};


/* ==============================
   📂 CATEGORIES
================================ */

const getCategoriesController = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name
      FROM categories
      ORDER BY name
    `);

    res.json({ categories: result.rows });

  } catch (err) {
    console.error("Categories error:", err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};


/* ==============================
   ✏️ UPDATE PRODUCT
================================ */

const updateProductController = async (req, res) => {
  try {
    const { name, description, price, stock, image_url, category, is_featured } = req.body;

    const result = await pool.query(`
      UPDATE products
      SET name=$1, description=$2, price=$3, stock=$4, image_url=$5, category=$6, is_featured=$7
      WHERE id=$8
      RETURNING *
    `, [name, description, price, stock, image_url, category, is_featured, req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json({ product: result.rows[0] });

  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
};


/* ==============================
   🗑️ DELETE PRODUCT
================================ */

const deleteProductController = async (req, res) => {
  try {
    await pool.query(`DELETE FROM products WHERE id=$1`, [req.params.id]);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
};


/* ==============================
   🔁 RELATED PRODUCTS
================================ */

const relatedProductsController = async (req, res) => {
  try {
    const { category, id } = req.params;

    const result = await pool.query(`
      SELECT *
      FROM products
      WHERE category = $1 AND id != $2
      LIMIT 4
    `, [category, id]);

    res.json({ products: result.rows });

  } catch (err) {
    console.error("Related error:", err);
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
  getCategoriesController,
  updateProductController,
  deleteProductController,
  relatedProductsController,
};
