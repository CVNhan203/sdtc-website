const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");
const sendMail = require("../controllers/emailController");
const Service = require("../models/serviceModel");

// Tạo đơn hàng mới
exports.createOrder = asyncHandler(async (req, res) => {
  const { serviceId, fullName, phone, email, paymentMethod } = req.body;
  // Lấy thông tin dịch vụ
  const service = await Service.findById(serviceId);
  const serviceTitle = service ? service.title : "Không xác định";
  const order = await Order.create({
    serviceId,
    fullName,
    phone,
    email,
    paymentMethod,
  });
  // Gửi email thông báo cho admin
  await sendMail(
    process.env.ADMIN_EMAIL || "hotansanh0304@gmail.com",
    "[SDTC] Có đơn hàng mới",
    `<h3>Đơn hàng mới vừa được tạo:</h3>
      <ul>
        <li><b>Họ tên:</b> ${fullName}</li>
        <li><b>Số điện thoại:</b> ${phone}</li>
        <li><b>Email:</b> ${email}</li>
        <li><b>ID dịch vụ:</b> ${serviceId}</li>
        <li><b>Tên dịch vụ:</b> ${serviceTitle}</li>
        <li><b>Phương thức thanh toán:</b> ${paymentMethod}</li>
      </ul>`
  );
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
    return res
      .status(404)
      .json({ success: false, message: "Không tìm thấy đơn hàng" });
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
    return res
      .status(404)
      .json({ success: false, message: "Không tìm thấy đơn hàng" });
  res.json({
    success: true,
    data: order,
    message: "Cập nhật trạng thái thành công",
  });
});
