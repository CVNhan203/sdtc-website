const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

const adminMiddleware = require("../middleware/adminMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

// Người dùng tạo đơn hàng
router.post("/", orderController.createOrder);

// Xử lý thanh toán đơn hàng
router.post("/:id/process-payment", orderController.processPayment);

// Admin xem tất cả đơn hàng
router.get("/", authMiddleware, adminMiddleware, orderController.getOrders);

// Admin xem chi tiết đơn hàng
router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  orderController.getOrderById
);

// Admin cập nhật trạng thái đơn hàng
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  orderController.updateOrderStatus
);

module.exports = router;
