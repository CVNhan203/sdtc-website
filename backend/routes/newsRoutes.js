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

// Routes công khai - không yêu cầu đăng nhập
router.get('/', getNews)
router.get('/:id', getNewsById)

// Route upload ảnh - công khai cho admin/staff
router.post('/upload', upload.single('image'), uploadNewsImage)

// Routes yêu cầu xác thực Admin hoặc Staff
router.use(authMiddleware)
router.use(adminOrStaffMiddleware)

// Route cho thùng rác phải đặt trước các route có pattern /:id
router.get('/trash', getTrashNews)

// Routes thao tác nhiều items
router.post('/delete-many', deleteNewsMany)

// Routes CRUD cơ bản
router.post('/', createNews)

// Tạo bài viết mới (yêu cầu admin hoặc staff)
router.post('/', adminOrStaffMiddleware, createNews)

// Cập nhật bài viết (yêu cầu admin hoặc staff)
router.put('/:id', adminOrStaffMiddleware, updateNews)

//Xóa nhiều bài viết (yêu cầu admin hoặc staff)
router.delete('/many', adminOrStaffMiddleware, deleteNewsMany)

// Xóa bài viết (yêu cầu admin hoặc staff)
router.delete('/:id', adminOrStaffMiddleware, deleteNews)

// Khôi phục bài viết (yêu cầu admin hoặc staff)
router.patch('/:id/restore', adminOrStaffMiddleware, restoreNews)

// Xóa vĩnh viễn bài viết (yêu cầu admin hoặc staff)
router.delete('/:id/permanent', adminOrStaffMiddleware, permanentDeleteNews)

module.exports = router
