const pool = require("../config/db");

/* ADD */
exports.addToWishlist = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  await pool.query(
    `INSERT INTO wishlists (user_id, product_id)
     VALUES ($1,$2)
     ON CONFLICT DO NOTHING`,
    [userId, productId]
  );

  res.json({ success: true, message: "Added to wishlist" });
};

/* GET */
exports.getWishlist = async (req, res) => {
  const userId = req.user.id;

  const result = await pool.query(
    `SELECT p.*
     FROM wishlists w
     JOIN products p ON p.id = w.product_id
     WHERE w.user_id = $1
     ORDER BY w.created_at DESC`,
    [userId]
  );

  res.json(result.rows);
};

/* REMOVE */
exports.removeFromWishlist = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  await pool.query(
    `DELETE FROM wishlists 
     WHERE user_id=$1 AND product_id=$2`,
    [userId, productId]
  );

  res.json({ success: true, message: "Removed from wishlist" });
};
