const express = require('express')
const router = express.Router()
const upload = require('../middleware/uploadImage')

const {
  getNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  deleteNewsMany,
  uploadNewsImage,
  restoreNews,
  permanentDeleteNews,
  getTrashNews,
} = require('../controllers/newsController')

const adminMiddleware = require('../middleware/adminMiddleware')
const authMiddleware = require('../middleware/authMiddleware')
const adminOrStaffMiddleware = require('../middleware/adminOrStaffMiddleware')

// Route upload ảnh - công khai cho admin/staff
router.post('/upload', upload.single('image'), uploadNewsImage)

// Đặt route thùng rác TRƯỚC route /:id để tránh xung đột
router.get('/trash', authMiddleware, adminOrStaffMiddleware, getTrashNews)

// Route khôi phục bài viết (quan trọng - phải đặt trước các route ID)
router.patch('/:id/restore', authMiddleware, adminOrStaffMiddleware, restoreNews)

// Route xóa vĩnh viễn cũng quan trọng - phải đặt trước route /:id
router.delete('/:id/permanent', authMiddleware, adminOrStaffMiddleware, permanentDeleteNews)

// Routes thao tác nhiều items - phải đặt trước /:id
router.post('/delete-many', authMiddleware, adminOrStaffMiddleware, deleteNewsMany)
router.delete('/many', authMiddleware, adminOrStaffMiddleware, deleteNewsMany)

// Routes CRUD cơ bản
router.post('/', authMiddleware, adminOrStaffMiddleware, createNews)

// Routes cần xác thực
router.put('/:id', authMiddleware, adminOrStaffMiddleware, updateNews)
router.delete('/:id', authMiddleware, adminOrStaffMiddleware, deleteNews)

// Routes công khai - không yêu cầu đăng nhập
router.get('/', getNews)
// Route /:id phải đặt CUỐI CÙNG để tránh xung đột với các route khác
router.get('/:id', getNewsById)

module.exports = router
