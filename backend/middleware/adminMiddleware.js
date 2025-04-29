const Admin = require('../models/adminModel');
const asyncHandler = require('express-async-handler');

// Middleware kiểm tra trạng thái hoạt động của admin
const checkActiveStatus = asyncHandler(async (req, res, next) => {
  if (req.admin && req.admin.isActive) {
    next();
  } else {
    res.status(403);
    throw new Error('Tài khoản admin đã bị vô hiệu hóa');
  }
});

// Middleware cập nhật thời gian đăng nhập cuối
const updateLastLogin = asyncHandler(async (req, res, next) => {
  if (req.admin) {
    await Admin.findByIdAndUpdate(req.admin._id, {
      lastLogin: new Date()
    });
  }
  next();
});

module.exports = { checkActiveStatus, updateLastLogin };
