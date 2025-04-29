const asyncHandler = require("express-async-handler");
const Payment = require("../models/paymentModel");
const Order = require("../models/orderModel");
const sendMail = require("../controllers/emailController");

// Tạo payment (khi bắt đầu thanh toán)
exports.createPayment = asyncHandler(async (req, res) => {
  const { orderId, method } = req.body;
  const payment = await Payment.create({ orderId, method, status: "pending" });
  res.status(201).json({ success: true, data: payment, message: "Khởi tạo thanh toán thành công" });
});

// Cập nhật trạng thái thanh toán (giả lập)
exports.confirmPayment = asyncHandler(async (req, res) => {
  const { orderId, method, status } = req.body;
  // Cập nhật trạng thái payment
  const payment = await Payment.findOneAndUpdate(
    { orderId, method },
    { status: status || "paid" },
    { new: true }
  );
  // Cập nhật trạng thái đơn hàng nếu thanh toán thành công
  if (payment && payment.status === "paid") {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { paymentStatus: "paid", orderStatus: "processing" },
      { new: true }
    );
    // Gửi email xác nhận
    if (order) {
      await sendMail(
        order.email,
        "Xác nhận đặt hàng thành công",
        `<h3>Chào ${order.fullName},</h3><p>Bạn đã đặt hàng thành công với phương thức thanh toán ${method}.</p><p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>`
      );
    }
  }
  res.json({
    success: true,
    message: "Cập nhật trạng thái thanh toán thành công",
    data: payment,
  });
});
