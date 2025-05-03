const Admin = require("../models/adminModel");
const Order = require("../models/orderModel");
const Payment = require("../models/paymentModel");
const Service = require("../models/serviceModel");
const News = require("../models/newsModel");
const Booking = require("../models/bookingModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

// Đăng nhập admin
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin)
    return res
      .status(401)
      .json({ success: false, message: "Sai tài khoản hoặc mật khẩu" });
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch)
    return res
      .status(401)
      .json({ success: false, message: "Sai tài khoản hoặc mật khẩu" });
  // Tạo token
  const token = jwt.sign(
    { id: admin._id, role: admin.role },
    process.env.JWT_SECRET || "secret",

    { expiresIn: "1h" }

  );
  res.json({
    success: true,
    token,
    admin: { fullName: admin.fullName, email: admin.email, role: admin.role },
});

// Thống kê dashboard
exports.getDashboardStats = asyncHandler(async (req, res) => {
  const [orderCount, paymentCount, serviceCount, newsCount, bookingsCount] =
    await Promise.all([
      Order.countDocuments(),
      Payment.countDocuments(),
      Service.countDocuments(),
      News.countDocuments(),
      Booking.countDocuments(),
    ]);
  res.json({
    success: true,
    data: {
      orders: orderCount,
      payments: paymentCount,
      services: serviceCount,
      news: newsCount,
      bookings: bookingsCount,
    },
  });
});
});
