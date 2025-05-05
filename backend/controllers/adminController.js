const Admin = require("../models/adminModel");
const Order = require("../models/orderModel");
const Payment = require("../models/paymentModel");
const Service = require("../models/serviceModel");
const News = require("../models/newsModel");
const Booking = require("../models/bookingModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Staff = require("../models/staffModel");

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

// @desc    Tạo tài khoản staff
// @route   POST /api/admin/staff
// @access  Private (Admin)
const createStaff = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!fullName || !email || !password) {
    res.status(400);
    throw new Error("Vui lòng điền đầy đủ thông tin");
  }

  // Kiểm tra email đã tồn tại chưa
  const staffExists = await Staff.findOne({ email });
  if (staffExists) {
    res.status(400);
    throw new Error("Email đã được sử dụng");
  }

  // Chuẩn bị dữ liệu staff
  const staffData = {
    fullName,
    email,
    password
  };

  // Thêm createdBy nếu có thông tin admin
  if (req.admin && req.admin.id) {
    staffData.createdBy = req.admin.id;
  }

  // Tạo tài khoản staff mới
  const staff = await Staff.create(staffData);

  if (staff) {
    res.status(201).json({
      _id: staff._id,
      fullName: staff.fullName,
      email: staff.email,
      role: staff.role,
      isActive: staff.isActive
    });
  } else {
    res.status(400);
    throw new Error("Dữ liệu staff không hợp lệ");
  }
});

// @desc    Lấy danh sách tất cả staff
// @route   GET /api/admin/staff
// @access  Private (Admin)
const getAllStaff = asyncHandler(async (req, res) => {
  const staffList = await Staff.find({}).select("-password");
  res.json(staffList);
});

// @desc    Lấy thông tin chi tiết staff
// @route   GET /api/admin/staff/:id
// @access  Private (Admin)
const getStaffById = asyncHandler(async (req, res) => {
  const staff = await Staff.findById(req.params.id).select("-password");
  
  if (staff) {
    res.json(staff);
  } else {
    res.status(404);
    throw new Error("Không tìm thấy staff");
  }
});

// @desc    Cập nhật thông tin staff
// @route   PUT /api/admin/staff/:id
// @access  Private (Admin)
const updateStaff = asyncHandler(async (req, res) => {
  const staff = await Staff.findById(req.params.id);
  
  if (staff) {
    staff.fullName = req.body.fullName || staff.fullName;
    staff.email = req.body.email || staff.email;
    staff.isActive = req.body.isActive !== undefined ? req.body.isActive : staff.isActive;
    
    if (req.body.password) {
      staff.password = req.body.password;
    }
    
    const updatedStaff = await staff.save();
    
    res.json({
      _id: updatedStaff._id,
      fullName: updatedStaff.fullName,
      email: updatedStaff.email,
      role: updatedStaff.role,
      isActive: updatedStaff.isActive
    });
  } else {
    res.status(404);
    throw new Error("Không tìm thấy staff");
  }
});

// @desc    Vô hiệu hóa tài khoản staff
// @route   DELETE /api/admin/staff/:id
// @access  Private (Admin)
const deactivateStaff = asyncHandler(async (req, res) => {
  const staff = await Staff.findById(req.params.id);
  
  if (staff) {
    staff.isActive = false;
    await staff.save();
    
    res.json({ message: "Tài khoản staff đã bị vô hiệu hóa" });
  } else {
    res.status(404);
    throw new Error("Không tìm thấy staff");
  }
});

module.exports = {
  login: exports.login,
  getDashboardStats: exports.getDashboardStats,
  createStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deactivateStaff,
};
