const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const adminMiddleware = require("../middleware/adminMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

// Đăng nhập admin
router.post("/login", authMiddleware, adminController.login);
// Thống kê Dashboard
router.get("/dashboard", authMiddleware, adminController.getDashboardStats);

module.exports = router;
