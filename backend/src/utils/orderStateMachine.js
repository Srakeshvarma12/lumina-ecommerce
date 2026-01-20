const ORDER_STATES = {
  CREATED: "CREATED",
  PAID: "PAID",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED",
};

const allowedTransitions = {
  CREATED: ["PAID", "CANCELLED"],
  PAID: ["SHIPPED", "REFUNDED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
  REFUNDED: [],
};

function canTransition(current, next) {
  if (!ORDER_STATES[current]) return false;
  return allowedTransitions[current].includes(next);
}

module.exports = {
  ORDER_STATES,
  canTransition,
};
