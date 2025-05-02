const express = require('express');
const router = express.Router();
const {
  loginAdmin,
  logoutAdmin,
  getAdminProfile,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

// Routes công khai
router.post('/login', loginAdmin);

// Routes được bảo vệ bởi middleware
router.use(protect); // Áp dụng middleware xác thực cho tất cả các routes bên dưới

// Routes cho admin đã đăng nhập
router.post('/logout', logoutAdmin);
router.get('/profile', getAdminProfile);

module.exports = router;
