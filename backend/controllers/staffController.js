const Staff = require("../models/staffModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

// Tạo JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Đăng nhập dành cho staff
// @route   POST /api/staff/login
// @access  Public
const loginStaff = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Vui lòng nhập email và mật khẩu");
  }

  // Kiểm tra staff tồn tại
  const staff = await Staff.findOne({ email }).select("+password");

  if (!staff) {
    res.status(401);
    throw new Error("Sai email hoặc mật khẩu");
  }

  // Kiểm tra tài khoản có bị vô hiệu không
  if (!staff.isActive) {
    res.status(401);
    throw new Error("Tài khoản đã bị vô hiệu hóa");
  }

  // Kiểm tra mật khẩu
  const isMatch = await staff.matchPassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error("Sai email hoặc mật khẩu");
  }

  res.json({
    _id: staff._id,
    fullName: staff.fullName,
    email: staff.email,
    role: staff.role,
    token: generateToken(staff._id),
  });
});

// @desc    Lấy thông tin profile staff
// @route   GET /api/staff/profile
// @access  Private (Staff)
const getStaffProfile = asyncHandler(async (req, res) => {
  const staff = await Staff.findById(req.staff._id);

  if (staff) {
    res.json({
      _id: staff._id,
      fullName: staff.fullName,
      email: staff.email,
      role: staff.role,
    });
  } else {
    res.status(404);
    throw new Error("Không tìm thấy thông tin staff");
  }
});

// @desc    Cập nhật profile staff
// @route   PUT /api/staff/profile
// @access  Private (Staff)
const updateStaffProfile = asyncHandler(async (req, res) => {
  const staff = await Staff.findById(req.staff._id);

  if (staff) {
    staff.fullName = req.body.fullName || staff.fullName;
    staff.email = req.body.email || staff.email;

    if (req.body.password) {
      staff.password = req.body.password;
    }

    const updatedStaff = await staff.save();

    res.json({
      _id: updatedStaff._id,
      fullName: updatedStaff.fullName,
      email: updatedStaff.email,
      token: generateToken(updatedStaff._id),
    });
  } else {
    res.status(404);
    throw new Error("Không tìm thấy thông tin staff");
  }
});

module.exports = {
  loginStaff,
  getStaffProfile,
  updateStaffProfile,
}; 