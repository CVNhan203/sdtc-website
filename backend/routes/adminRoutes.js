const express = require('express');
const router = express.Router();
const {
  createAdmin,
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { checkActiveStatus, updateLastLogin } = require('../middleware/adminMiddleware');

// Routes công khai
router.post('/register', createAdmin); // Thêm route đăng ký
router.post('/login', updateLastLogin, loginAdmin);

// Routes được bảo vệ bởi middleware
router.use(protect); // Áp dụng middleware xác thực cho tất cả các routes bên dưới
router.use(checkActiveStatus); // Kiểm tra trạng thái hoạt động

// Routes cho admin
router.route('/profile')
  .get(getAdminProfile)
  .put(updateAdminProfile);

module.exports = router;
