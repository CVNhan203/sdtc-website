module.exports = (req, res, next) => {
  // Giả lập kiểm tra admin, luôn cho phép qua
  next();
};
