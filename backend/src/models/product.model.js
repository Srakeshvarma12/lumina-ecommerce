const pool = require("../config/db");

/* ================= CREATE ================= */

const createProduct = async (
  name,
  description,
  price,
  stock,
  imageUrl,
  category,
  isFeatured,
  userId
) => {
  const result = await pool.query(
    `INSERT INTO products 
     (name, description, price, stock, image_url, category, is_featured, created_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     RETURNING *`,
    [name, description, price, stock, imageUrl, category, isFeatured, userId]
  );

  return result.rows[0];
};

/* ================= READ ================= */

const getAllProducts = async () => {
  const result = await pool.query(
    `SELECT id, name, description, price, stock, image_url, category
     FROM products
     ORDER BY created_at DESC`
  );
  return result.rows;
};

const getFeaturedProducts = async () => {
  const result = await pool.query(
    `SELECT id, name, description, price, stock, image_url, category
     FROM products
     WHERE is_featured = true
     ORDER BY created_at DESC
     LIMIT 8`
  );
  return result.rows;
};

const getLatestProducts = async () => {
  const result = await pool.query(
    `SELECT id, name, description, price, stock, image_url, category
     FROM products
     ORDER BY created_at DESC
     LIMIT 12`
  );
  return result.rows;
};

const getProductsByCategory = async (category) => {
  const result = await pool.query(
    `SELECT id, name, description, price, stock, image_url, category
     FROM products
     WHERE LOWER(category) = LOWER($1)
     ORDER BY created_at DESC`,
    [category]
  );

  return result.rows;
};

const searchProducts = async (query) => {
  const result = await pool.query(
    `SELECT id, name, description, price, stock, image_url, category
     FROM products
     WHERE name ILIKE $1 OR description ILIKE $1
     ORDER BY created_at DESC`,
    [`%${query}%`]
  );

  return result.rows;
};

const getProductById = async (id) => {
  const result = await pool.query(
    `SELECT id, name, description, price, stock, image_url, category
     FROM products
     WHERE id = $1`,
    [id]
  );

  return result.rows[0];
};

/* ================= UPDATE / DELETE ================= */

const updateProduct = async (
  id,
  name,
  description,
  price,
  stock,
  imageUrl,
  category,
  isFeatured
) => {
  const result = await pool.query(
    `UPDATE products SET 
      name=$1,
      description=$2,
      price=$3,
      stock=$4,
      image_url=$5,
      category=$6,
      is_featured=$7
     WHERE id=$8
     RETURNING *`,
    [name, description, price, stock, imageUrl, category, isFeatured, id]
  );

  return result.rows[0];
};

const deleteProduct = async (id) => {
  const result = await pool.query(
    `DELETE FROM products WHERE id=$1 RETURNING id`,
    [id]
  );
  return result.rows[0];
};

/* ================= STOCK ================= */

const getProductStockById = async (id) => {
  const result = await pool.query(
    `SELECT stock FROM products WHERE id=$1`,
    [id]
  );
  return result.rows[0];
};

const getRelatedProducts = async (category, productId) => {
  const result = await pool.query(
    `SELECT id, name, price, image_url, category
     FROM products
     WHERE category = $1 AND id != $2
     ORDER BY RANDOM()
     LIMIT 4`,
    [category, productId]
  );

  return result.rows;
};

module.exports = {
  createProduct,
  getAllProducts,
  getFeaturedProducts,
  getLatestProducts,
  getProductsByCategory,
  searchProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductStockById,
  getRelatedProducts,
};
