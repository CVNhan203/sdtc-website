const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

const staffMiddleware = asyncHandler(async (req, res, next) => {
  let token;

  // Kiểm tra token trong header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Lấy thông tin user từ token, loại bỏ password
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        res.status(401);
        throw new Error('Không tìm thấy người dùng');
      }

      // Kiểm tra role staff
      if (user.role !== 'staff') {
        res.status(403);
        throw new Error('Không có quyền truy cập, chỉ Staff mới được phép');
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

module.exports = staffMiddleware;