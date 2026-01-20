const pool = require("../config/db");
const createOrder = async (userId, totalAmount) => {
  const query = `
    INSERT INTO orders (user_id, total_amount)
    VALUES ($1, $2)
    RETURNING id, user_id, total_amount, status, created_at
  `;

  const result = await pool.query(query, [userId, totalAmount]);
  return result.rows[0];
};

const createOrderItems = async (orderId, items) => {
  const query = `
    INSERT INTO order_items (order_id, product_id, quantity, price)
    VALUES ($1, $2, $3, $4)
  `;

  for (const item of items) {
    await pool.query(query, [
      orderId,
      item.product_id,
      item.quantity,
      item.price,
    ]);
  }
};

const getOrdersByUser = async (userId) => {
  const query = `
    SELECT id, total_amount, status, created_at
    FROM orders
    WHERE user_id = $1
    ORDER BY created_at DESC
  `;

  const result = await pool.query(query, [userId]);
  return result.rows;
};

const getUserOrderHistory = async (userId) => {
  const query = `
    SELECT
      o.id AS order_id,
      o.total_amount,
      o.status,
      o.payment_id,
      o.created_at,
      json_agg(
        json_build_object(
          'product_id', p.id,
          'name', p.name,
          'price', oi.price,
          'quantity', oi.quantity
        )
      ) AS items
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = $1
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `;

  const result = await pool.query(query, [userId]);
  return result.rows;
};

const getAllOrdersAdmin = async () => {
  const query = `
    SELECT
      o.id AS order_id,
      o.user_id,
      o.total_amount,
      o.status,
      o.payment_id,
      o.created_at,
      json_agg(
        json_build_object(
          'product_id', p.id,
          'name', p.name,
          'price', oi.price,
          'quantity', oi.quantity
        )
      ) AS items
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `;
  const result = await pool.query(query);
  return result.rows;
};

const getOrderFullDetailsById = async (orderId) => {
  const query = `
    SELECT
      o.id AS order_id,
      o.total_amount,
      o.status,
      o.payment_id,
      o.razorpay_order_id,
      o.created_at,

      u.id AS user_id,
      u.name AS user_name,
      u.email,

      json_agg(
        json_build_object(
          'product_id', p.id,
          'name', p.name,
          'price', oi.price,
          'quantity', oi.quantity
        )
      ) AS items

    FROM orders o
    JOIN users u ON o.user_id = u.id
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE o.id = $1
    GROUP BY o.id, u.id
  `;

  const result = await pool.query(query, [orderId]);
  return result.rows[0];
};

module.exports = {
  createOrder,
  createOrderItems,
  getOrdersByUser,
  getUserOrderHistory,
  getAllOrdersAdmin ,
  getOrderFullDetailsById,
};

