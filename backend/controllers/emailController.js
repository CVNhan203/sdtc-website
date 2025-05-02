const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");
const Email = require("../models/emailModel");

// Khởi tạo transporter cho nodemailer với email admin
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL, // Email của admin dùng để gửi
    pass: process.env.ADMIN_EMAIL_PASSWORD // Mật khẩu ứng dụng của email admin
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Kiểm tra kết nối email
const verifyConnection = async () => {
  try {
    await transporter.verify();
    console.log("Kết nối email admin thành công!");
    return true;
  } catch (error) {
    console.error("Lỗi kết nối email admin:", error);
    return false;
  }
};

// @desc    Gửi email và lưu thông tin khách hàng
// @route   POST /api/emails
// @access  Public
const sendEmail = asyncHandler(async (req, res) => {
  const { fullname, phone, email, demand, note } = req.body;

  // Validate input
  if (!fullname || !phone || !email || !demand) {
    res.status(400);
    throw new Error("Vui lòng điền đầy đủ thông tin");
  }

  try {
    // Lưu thông tin vào database
    const newEmail = await Email.create({
      fullname,
      phone,
      email,
      demand,
      note: note || '' // Đảm bảo note luôn có giá trị, mặc định là chuỗi rỗng
    });

    // Gửi email thông báo cho các admin khác (nếu có)
    const adminNotificationOptions = {
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_NOTIFICATION_EMAILS || process.env.ADMIN_EMAIL,
      subject: "Yêu cầu tư vấn mới từ website",
      html: `
        <h2>Thông tin khách hàng:</h2>
        <p><strong>Họ và tên:</strong> ${fullname}</p>
        <p><strong>Số điện thoại:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Nhu cầu:</strong> ${demand}</p>
        <p><strong>Ghi chú:</strong> ${note || 'Không có'}</p>
        <p><strong>Thời gian:</strong> ${new Date().toLocaleString('vi-VN')}</p>
      `
    };

    // Gửi email phản hồi cho khách hàng
    const customerMailOptions = {
      from: {
        name: "SDTC Support",
        address: process.env.ADMIN_EMAIL
      },
      to: email,
      subject: "Xác nhận yêu cầu tư vấn - SDTC",
      html: `
        <h2>Xin chào ${fullname},</h2>
        <p>Cảm ơn bạn đã quan tâm đến dịch vụ của SDTC.</p>
        <p>Chúng tôi đã nhận được yêu cầu tư vấn của bạn với thông tin sau:</p>
        <ul>
          <li><strong>Nhu cầu:</strong> ${demand}</li>
          <li><strong>Số điện thoại:</strong> ${phone}</li>
          <li><strong>Email:</strong> ${email}</li>
          ${note ? `<li><strong>Ghi chú:</strong> ${note}</li>` : ''}
        </ul>
        <p>Đội ngũ SDTC sẽ liên hệ với bạn trong thời gian sớm nhất.</p>
        <br/>
        <p>Trân trọng,</p>
        <p>Đội ngũ SDTC</p>
      `
    };

    // Gửi cả hai email
    await Promise.all([
      transporter.sendMail(adminNotificationOptions),
      transporter.sendMail(customerMailOptions)
    ]);

    res.status(201).json({
      success: true,
      message: "Gửi yêu cầu thành công",
      data: newEmail
    });
  } catch (error) {
    res.status(500);
    throw new Error("Lỗi khi gửi email: " + error.message);
  }
});

// @desc    Lấy danh sách yêu cầu tư vấn
// @route   GET /api/emails
// @access  Private/Admin
const getEmails = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const query = status ? { status } : {};

  const skip = (Number(page) - 1) * Number(limit);

  const [emails, total] = await Promise.all([
    Email.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Email.countDocuments(query)
  ]);

  const totalPages = Math.ceil(total / Number(limit));

  res.json({
    success: true,
    data: emails,
    pagination: {
      total,
      totalPages,
      currentPage: Number(page),
      limit: Number(limit)
    }
  });
});

// @desc    Cập nhật trạng thái yêu cầu
// @route   PUT /api/emails/:id
// @access  Private/Admin
const updateEmailStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;

  const email = await Email.findById(req.params.id);

  if (!email) {
    res.status(404);
    throw new Error("Không tìm thấy yêu cầu");
  }

  email.status = status || email.status;
  email.note = note || email.note;
  email.updatedAt = Date.now();

  const updatedEmail = await email.save();

  res.json({
    success: true,
    data: updatedEmail
  });
});

// @desc    Xóa yêu cầu
// @route   DELETE /api/emails/:id
// @access  Private/Admin
const deleteEmail = asyncHandler(async (req, res) => {
  const email = await Email.findById(req.params.id);

  if (!email) {
    res.status(404);
    throw new Error("Không tìm thấy yêu cầu");
  }

  await email.deleteOne();

  res.json({
    success: true,
    message: "Đã xóa yêu cầu thành công"
  });
});

module.exports = {
  sendEmail,
  getEmails,
  updateEmailStatus,
  deleteEmail,
  verifyConnection
};
