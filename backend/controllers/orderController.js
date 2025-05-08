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
  const servicePrice = service ? service.price : 0;
  
  const order = await Order.create({
    serviceId,
    fullName,
    phone,
    email,
    paymentMethod,
    paymentAmount: servicePrice,
    orderStatus: "pending",
    paymentStatus: "pending"
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
        <li><b>Số tiền:</b> ${servicePrice.toLocaleString('vi-VN')} VND</li>
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
  const { orderStatus, paymentStatus, paymentAmount } = req.body;
  const updateData = { orderStatus };
  
  // Nếu có cập nhật trạng thái thanh toán
  if (paymentStatus) {
    updateData.paymentStatus = paymentStatus;
    
    // Nếu trạng thái thanh toán là "đã thanh toán", cập nhật ngày thanh toán
    if (paymentStatus === "paid") {
      updateData.paymentDate = new Date();
      if (paymentAmount) {
        updateData.paymentAmount = paymentAmount;
      }
    }
  }
  
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { $set: updateData },
    { new: true }
  );
  
  if (!order)
    return res
      .status(404)
      .json({ success: false, message: "Không tìm thấy đơn hàng" });
  
  // Gửi email thông báo cho khách hàng nếu trạng thái thanh toán là "đã thanh toán"
  if (paymentStatus === "paid") {
    try {
      // Lấy thông tin dịch vụ
      const service = await Service.findById(order.serviceId);
      const serviceTitle = service ? service.title : "Không xác định";
      
      await sendMail(
        order.email,
        "[SDTC] Xác nhận thanh toán thành công",
        `<h2>Xác nhận thanh toán thành công</h2>
        <p>Chào ${order.fullName},</p>
        <p>Chúng tôi xác nhận đã nhận được thanh toán của bạn cho dịch vụ <strong>${serviceTitle}</strong>.</p>
        <p><strong>Thông tin đơn hàng:</strong></p>
        <ul>
          <li>Mã đơn hàng: ${order._id}</li>
          <li>Dịch vụ: ${serviceTitle}</li>
          <li>Số tiền: ${order.paymentAmount.toLocaleString('vi-VN')} VND</li>
          <li>Phương thức thanh toán: ${order.paymentMethod}</li>
          <li>Ngày thanh toán: ${new Date().toLocaleDateString('vi-VN')}</li>
        </ul>
        <p>Đơn hàng của bạn đã được chuyển sang trạng thái <strong>${orderStatus === "processing" ? "Đang triển khai" : orderStatus === "completed" ? "Hoàn thành" : "Chờ xử lý"}</strong>.</p>
        <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
        <p>Trân trọng,<br>SDTC Team</p>`
      );
    } catch (error) {
      console.error("Lỗi khi gửi email xác nhận thanh toán:", error);
    }
  }
  
  res.json({
    success: true,
    data: order,
    message: "Cập nhật trạng thái thành công",
  });
});

// Xử lý thanh toán đơn hàng
exports.processPayment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { transactionId, amount } = req.body;
  
  // Kiểm tra đơn hàng có tồn tại không
  const order = await Order.findById(id);
  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Không tìm thấy đơn hàng",
    });
  }
  
  // Cập nhật thông tin thanh toán
  order.paymentStatus = "paid";
  order.paymentDate = new Date();
  order.paymentTransactionId = transactionId;
  order.orderStatus = "processing"; // Chuyển trạng thái đơn hàng sang "đang xử lý"
  
  if (amount) {
    order.paymentAmount = amount;
  }
  
  await order.save();
  
  // Lấy thông tin dịch vụ
  const service = await Service.findById(order.serviceId);
  const serviceTitle = service ? service.title : "Không xác định";
  
  // Gửi email xác nhận thanh toán cho khách hàng
  try {
    await sendMail(
      order.email,
      "[SDTC] Xác nhận thanh toán thành công",
      `<h2>Xác nhận thanh toán thành công</h2>
      <p>Chào ${order.fullName},</p>
      <p>Chúng tôi xác nhận đã nhận được thanh toán của bạn cho dịch vụ <strong>${serviceTitle}</strong>.</p>
      <p><strong>Thông tin đơn hàng:</strong></p>
      <ul>
        <li>Mã đơn hàng: ${order._id}</li>
        <li>Dịch vụ: ${serviceTitle}</li>
        <li>Số tiền: ${order.paymentAmount.toLocaleString('vi-VN')} VND</li>
        <li>Phương thức thanh toán: ${order.paymentMethod}</li>
        <li>Mã giao dịch: ${transactionId}</li>
        <li>Ngày thanh toán: ${new Date().toLocaleDateString('vi-VN')}</li>
      </ul>
      <p>Đơn hàng của bạn đã được chuyển sang trạng thái <strong>Đang triển khai</strong>.</p>
      <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
      <p>Trân trọng,<br>SDTC Team</p>`
    );
  } catch (error) {
    console.error("Lỗi khi gửi email xác nhận thanh toán:", error);
  }
  
  res.json({
    success: true,
    data: order,
    message: "Xử lý thanh toán thành công",
  });
});
