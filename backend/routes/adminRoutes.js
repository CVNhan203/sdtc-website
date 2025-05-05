const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const adminMiddleware = require("../middleware/adminMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

// Đăng nhập admin
router.post("/login", adminController.login);
// Thống kê Dashboard
router.get("/dashboard", authMiddleware, adminController.getDashboardStats);
// Quản lý staff (chỉ admin)
router.get("/staffs", authMiddleware, adminMiddleware, adminController.getStaffs);
router.get("/staffs/:id", authMiddleware, adminMiddleware, adminController.getStaffById);
router.post("/staffs", authMiddleware, adminMiddleware, adminController.createStaff);
router.put("/staffs/:id", authMiddleware, adminMiddleware, adminController.updateStaff);
router.delete("/staffs/:id", authMiddleware, adminMiddleware, adminController.deleteStaff);

module.exports = router;