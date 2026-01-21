const pool = require("../config/db");

/* ================= CREATE ================= */

const createProduct = async (
  name,
  description,
  price,
  stock,
  imageUrl,
  category_id,
  isFeatured,
  userId
) => {
  const result = await pool.query(
    `INSERT INTO products 
     (name, description, price, stock, image_url, category_id, is_featured, created_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     RETURNING *`,
    [name, description, price, stock, imageUrl, category_id, isFeatured, userId]
  );

  return result.rows[0];
};

/* ================= READ ================= */

const getAllProducts = async () => {
  const result = await pool.query(`
    SELECT 
      p.id,
      p.name,
      p.description,
      p.price,
      p.stock,
      p.image_url,
      p.created_at,
      c.name AS category
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.created_at DESC
  `);

  return result.rows;
};

const getFeaturedProducts = async () => {
  const result = await pool.query(`
    SELECT 
      p.id,
      p.name,
      p.description,
      p.price,
      p.stock,
      p.image_url,
      p.created_at,
      c.name AS category
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.is_featured = true
    ORDER BY p.created_at DESC
    LIMIT 8
  `);

  return result.rows;
};

const getLatestProducts = async () => {
  const result = await pool.query(`
    SELECT 
      p.id,
      p.name,
      p.description,
      p.price,
      p.stock,
      p.image_url,
      p.created_at,
      c.name AS category
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.created_at DESC
    LIMIT 12
  `);

  return result.rows;
};

const getProductsByCategory = async (categoryName) => {
  const result = await pool.query(`
    SELECT 
      p.id,
      p.name,
      p.description,
      p.price,
      p.stock,
      p.image_url,
      p.created_at,
      c.name AS category
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE LOWER(c.name) = LOWER($1)
    ORDER BY p.created_at DESC
  `, [categoryName]);

  return result.rows;
};

const searchProducts = async (query) => {
  const result = await pool.query(`
    SELECT 
      p.id,
      p.name,
      p.description,
      p.price,
      p.stock,
      p.image_url,
      p.created_at,
      c.name AS category
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.name ILIKE $1 OR p.description ILIKE $1
    ORDER BY p.created_at DESC
  `, [`%${query}%`]);

  return result.rows;
};

const getProductById = async (id) => {
  const result = await pool.query(`
    SELECT 
      p.id,
      p.name,
      p.description,
      p.price,
      p.stock,
      p.image_url,
      p.created_at,
      c.name AS category
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = $1
  `, [id]);

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
  category_id,
  isFeatured
) => {
  const result = await pool.query(
    `UPDATE products SET 
      name=$1,
      description=$2,
      price=$3,
      stock=$4,
      image_url=$5,
      category_id=$6,
      is_featured=$7
     WHERE id=$8
     RETURNING *`,
    [name, description, price, stock, imageUrl, category_id, isFeatured, id]
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

const getRelatedProducts = async (categoryName, productId) => {
  const result = await pool.query(`
    SELECT 
      p.id,
      p.name,
      p.price,
      p.image_url,
      c.name AS category
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE LOWER(c.name) = LOWER($1)
      AND p.id != $2
    ORDER BY RANDOM()
    LIMIT 4
  `, [categoryName, productId]);

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
