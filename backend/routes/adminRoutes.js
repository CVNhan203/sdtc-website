const express = require("express");
const router = express.Router();
const adminMiddleware = require("../middleware/adminMiddleware");
const {
  login,
  getDashboardStats,
  createStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deactivateStaff
} = require("../controllers/adminController");

// Đăng nhập admin
router.post("/login", login);
// Thống kê Dashboard
router.get("/dashboard", adminMiddleware, getDashboardStats);

// Routes quản lý staff
router.post("/staff", adminMiddleware, createStaff);
router.get("/staff", adminMiddleware, getAllStaff);
router.get("/staff/:id", adminMiddleware, getStaffById);
router.put("/staff/:id", adminMiddleware, updateStaff);
router.delete("/staff/:id", adminMiddleware, deactivateStaff);

module.exports = router;
