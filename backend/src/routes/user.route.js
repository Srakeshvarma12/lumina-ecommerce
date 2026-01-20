const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middlewares/auth.middleware");
const { signupUser, loginUser } = require("../controllers/user.controller");

/* ================= AUTH ================= */

// ✅ Register (frontend is calling /register)
router.post("/register", signupUser);

// ✅ Signup (keep this also, both will work)
router.post("/signup", signupUser);

// ✅ Login
router.post("/login", loginUser);

/* ================= USER PROTECTED ================= */

router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

/* ================= ADMIN PROTECTED ================= */

router.get("/admin-test", protect, adminOnly, (req, res) => {
  res.json({
    message: "Admin route accessed successfully",
  });
});

module.exports = router;
