const express = require("express");
const router = express.Router();
const { testMail } = require("../controllers/test.controller");

router.get("/mail", testMail);

module.exports = router;
