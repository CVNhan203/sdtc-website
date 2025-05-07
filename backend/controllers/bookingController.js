const asyncHandler = require("express-async-handler");
const Booking = require("../models/bookingModel");
const sendMail = require("../controllers/emailController");

// Người dùng đặt lịch tư vấn
exports.createBooking = asyncHandler(async (req, res) => {
  try {
    const { fullName, phone, email, service, note } = req.body;
    const booking = await Booking.create({
      fullName,
      phone,
      email,
      service,
      note,
    });

    // Gửi email cho admin
    try {
      await sendMail(
        process.env.ADMIN_EMAIL || "hotansanh0304@gmail.com",
        "[SDTC] Có người vừa đặt lịch tư vấn",
        `<h3>Khách hàng mới đặt lịch tư vấn:</h3>
        <ul>
          <li><b>Họ tên:</b> ${fullName}</li>
          <li><b>Số điện thoại:</b> ${phone}</li>
          <li><b>Email:</b> ${email}</li>
          <li><b>Dịch vụ:</b> ${service}</li>
          <li><b>Ghi chú:</b> ${note || "(Không có)"}</li>
        </ul>`
      );

      // Gửi email xác nhận cho người dùng
      await sendMail(
        email,
        "[SDTC] Xác nhận đặt lịch tư vấn",
        `<p>Chúng tôi đã nhận được thông tin đặt lịch tư vấn từ bạn, hãy đợi chúng tôi phản hồi nhé.</p>`
      );
    } catch (mailErr) {
      // Nếu lỗi gửi mail, vẫn trả về booking thành công, hoặc báo lỗi nhẹ
    }

    res.status(201).json({
      success: true,
      message:
        "Chúng tôi đã nhận được thông tin đặt lịch tư vấn từ bạn, hãy đợi chúng tôi phản hồi nhé",
      data: booking,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Lỗi hệ thống, vui lòng thử lại sau.' });
  }
});

// Admin lấy danh sách đặt lịch
exports.getBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find().sort({ createdAt: -1 });
  res.json({ success: true, data: bookings });
});

// Admin lấy chi tiết đặt lịch
exports.getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return res
      .status(404)
      .json({ success: false, message: "Không tìm thấy lịch tư vấn" });
  }
  res.json({ success: true, data: booking });
});

// Admin cập nhật trạng thái đặt lịch
exports.updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  if (!booking) {
    return res
      .status(404)
      .json({ success: false, message: "Không tìm thấy lịch tư vấn" });
  }

  // Nếu admin xác nhận đã phản hồi, gửi email cho người dùng
  if (status === "completed") {
    await sendMail(
      booking.email,
      "[SDTC] Đã xác nhận tư vấn",
      `<p>Xin chào ${booking.fullName},<br>Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi, chúng tôi sẽ hỗ trợ bạn qua email hoặc số điện thoại.</p>`
    );
  }

  res.json({
    success: true,
    data: booking,
    message: "Cập nhật trạng thái thành công",
  });
});
