const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");

// Tạo đơn hàng mới
exports.createOrder = asyncHandler(async (req, res) => {
  const { serviceId, fullName, phone, email, paymentMethod } = req.body;
  const order = await Order.create({
    serviceId,
    fullName,
    phone,
    email,
    paymentMethod,
  });
  res.status(201).json({
    success: true,
    data: order,
    message: "Đơn hàng đã được gửi đi, vui lòng chờ xác nhận!",
  });
});

// Lấy tất cả đơn hàng (admin)
exports.getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json({ success: true, data: orders });
});

// Lấy chi tiết đơn hàng
exports.getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order)
    return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
  res.json({ success: true, data: order });
});

// Cập nhật trạng thái đơn hàng (admin)
exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus, paymentStatus } = req.body;
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { $set: { orderStatus, paymentStatus } },
    { new: true }
  );
  if (!order)
    return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
  res.json({
    success: true,
    data: order,
    message: "Cập nhật trạng thái thành công",
  });
});