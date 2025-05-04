const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Người dùng đặt lịch tư vấn
router.post("/", bookingController.createBooking);

// Admin lấy danh sách đặt lịch
router.get("/", authMiddleware, adminMiddleware, bookingController.getBookings);

// Admin lấy chi tiết đặt lịch
router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  bookingController.getBookingById
);

// Admin cập nhật trạng thái đặt lịch
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  bookingController.updateBookingStatus
);

module.exports = router;
