const asyncHandler = require("express-async-handler");
const Admin = require("../models/adminModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Tạo token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Tạo admin mới
// @route   POST /api/admin/register
// @access  Public
const createAdmin = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Kiểm tra admin đã tồn tại
  const adminExists = await Admin.findOne({ email });
  if (adminExists) {
    res.status(400);
    throw new Error('Admin đã tồn tại');
  }

  // Tạo admin mới
  const admin = await Admin.create({
    username,
    email,
    password,
    isActive: true
  });

  if (admin) {
    res.status(201).json({
      _id: admin._id,
      username: admin.username,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } else {
    res.status(400);
    throw new Error('Dữ liệu admin không hợp lệ');
  }
});

// @desc    Đăng nhập admin
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });

  if (admin && (await admin.matchPassword(password))) {
    res.json({
      _id: admin._id,
      username: admin.username,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } else {
    res.status(401);
    throw new Error('Email hoặc mật khẩu không đúng');
  }
});

// @desc    Lấy thông tin admin
// @route   GET /api/admin/profile
// @access  Private
const getAdminProfile = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin._id);

  if (admin) {
    res.json({
      _id: admin._id,
      username: admin.username,
      email: admin.email,
      lastLogin: admin.lastLogin,
    });
  } else {
    res.status(404);
    throw new Error('Không tìm thấy admin');
  }
});

// @desc    Cập nhật thông tin admin
// @route   PUT /api/admin/profile
// @access  Private
const updateAdminProfile = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin._id);

  if (admin) {
    admin.username = req.body.username || admin.username;
    admin.email = req.body.email || admin.email;
    if (req.body.password) {
      admin.password = req.body.password;
    }

    const updatedAdmin = await admin.save();

    res.json({
      _id: updatedAdmin._id,
      username: updatedAdmin.username,
      email: updatedAdmin.email,
    });
  } else {
    res.status(404);
    throw new Error('Không tìm thấy admin');
  }
});

module.exports = {
  createAdmin,
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
};
