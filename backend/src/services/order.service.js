const pool = require("../config/db");
const { validateTransition } = require("./orderLifecycle.service");

async function updateOrderStatus(orderId, nextStatus) {
  const result = await pool.query(
    "SELECT status FROM orders WHERE id=$1",
    [orderId]
  );

  if (!result.rows.length) throw new Error("Order not found");

  const current = result.rows[0].status;

  if (!validateTransition(current, nextStatus)) {
    throw new Error(`Illegal transition: ${current} → ${nextStatus}`);
  }

  await pool.query(
    "UPDATE orders SET status=$1 WHERE id=$2",
    [nextStatus, orderId]
  );
}

module.exports = { updateOrderStatus };
