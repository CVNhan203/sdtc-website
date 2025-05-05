const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');
const asyncHandler = require('express-async-handler');

const adminOrStaffMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await Admin.findById(decoded.id).select('-password');
      if (!user) {
        res.status(401);
        throw new Error('Không tìm thấy người dùng');
      }
      if (user.role !== 'admin' && user.role !== 'staff') {
        res.status(403);
        throw new Error('Không có quyền truy cập');
      }
      req.user = user;
      next();
    } catch (error) {
      res.status(401);
      throw new Error('Token không hợp lệ');
    }
  }
  if (!token) {
    res.status(401);
    throw new Error('Không tìm thấy token xác thực');
  }
});

module.exports = adminOrStaffMiddleware; 