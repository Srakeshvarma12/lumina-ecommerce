const pool = require("../config/db");
const addItemToCart = async (userId, productId, quantity) => {
  const query = `
    INSERT INTO cart_items (user_id, product_id, quantity)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, product_id)
    DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
    RETURNING id, user_id, product_id, quantity
  `;

  const values = [userId, productId, quantity];

  const result = await pool.query(query, values);
  return result.rows[0];
};

const getCartItems = async (userId) => {
  const query = `
    SELECT 
    ci.id,
    ci.quantity,
    p.id AS product_id,
    p.name,
    p.price,
    p.image_url
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = $1
    ORDER BY ci.created_at DESC
  `;

  const result = await pool.query(query, [userId]);
  return result.rows;
};

const updateCartItemQuantity = async (userId, productId, quantity) => {
  const query = `
    UPDATE cart_items
    SET quantity = $3
    WHERE user_id = $1 AND product_id = $2
    RETURNING id, user_id, product_id, quantity
  `;

  const values = [userId, productId, quantity];

  const result = await pool.query(query, values);
  return result.rows[0];
};

const clearCart = async (userId) => {
  const query = `
    DELETE FROM cart_items
    WHERE user_id = $1
  `;

  await pool.query(query, [userId]);
};

const removeCartItem = async (userId, productId) => {
  const query = `
    DELETE FROM cart_items
    WHERE user_id = $1 AND product_id = $2
    RETURNING *
  `;

  const result = await pool.query(query, [userId, productId]);
  return result.rows[0];
};

module.exports = {
  addItemToCart,
  getCartItems,
  updateCartItemQuantity,
  clearCart,
  removeCartItem,
};
