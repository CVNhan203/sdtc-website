const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const adminMiddleware = require("../middleware/adminMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

// Tạo payment (giả lập)
router.post("/create", paymentController.createPayment);

// Xác nhận thanh toán thành công (giả lập)
router.post(
  "/confirm",
  authMiddleware,
  adminMiddleware,
  paymentController.confirmPayment
);

module.exports = router;
