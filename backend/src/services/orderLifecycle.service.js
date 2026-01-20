const allowedTransitions = {
  CREATED: ["PLACED"],
  PLACED: ["PAID", "CANCELLED"],
  PAID: ["SHIPPED", "REFUNDED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
  REFUNDED: []
};

function validateTransition(current, next) {
  return allowedTransitions[current]?.includes(next);
}

module.exports = { validateTransition };
