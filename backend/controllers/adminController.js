const asyncHandler = require("express-async-handler");
const Admin = require("../models/adminModel");
const jwt = require("jsonwebtoken");

// Tạo token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Đăng nhập admin
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });

  if (admin && (await admin.matchPassword(password))) {
    // Cập nhật thời gian đăng nhập cuối
    admin.lastLogin = new Date();
    await admin.save();

    res.json({
      _id: admin._id,
      email: admin.email,
      token: generateToken(admin._id),
      message: "Đăng nhập thành công"
    });
  } else {
    res.status(401);
    throw new Error('Email hoặc mật khẩu không đúng');
  }
});

// @desc    Đăng xuất admin
// @route   POST /api/admin/logout
// @access  Private
const logoutAdmin = asyncHandler(async (req, res) => {
  res.json({ message: "Đăng xuất thành công" });
});

// @desc    Lấy thông tin admin
// @route   GET /api/admin/profile
// @access  Private
const getAdminProfile = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin._id);

  if (admin) {
    res.json({
      _id: admin._id,
      email: admin.email,
      lastLogin: admin.lastLogin,
      message: "Lấy thông tin admin thành công"
    });
  } else {
    res.status(404);
    throw new Error('Không tìm thấy admin');
  }
});

module.exports = {
  loginAdmin,
  logoutAdmin,
  getAdminProfile,
};
