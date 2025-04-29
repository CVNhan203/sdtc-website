module.exports = (req, res, next) => {
  // Giả lập: kiểm tra nếu req.user && req.user.role === 'admin'
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Bạn không có quyền truy cập (admin only)' });
};
