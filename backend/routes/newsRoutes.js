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

const adminOrStaffMiddleware = require('../middleware/adminOrStaffMiddleware')
const authMiddleware = require('../middleware/authMiddleware')

// Lấy danh sách bài viết (công khai)
router.get('/', getNews)

// Lấy tin tức trong thùng rác (đã xóa)
router.get('/trash', authMiddleware, adminOrStaffMiddleware, getTrashNews)

// Lấy chi tiết bài viết (công khai)
router.get('/:id', getNewsById)

// Route upload ảnh
router.post(
  '/upload',
  authMiddleware,
  adminOrStaffMiddleware,
  upload.single('image'),
  uploadNewsImage
)

// Tạo bài viết mới (yêu cầu admin hoặc staff)
router.post('/', authMiddleware, adminOrStaffMiddleware, createNews)

// Cập nhật bài viết (yêu cầu admin hoặc staff)
router.put('/:id', authMiddleware, adminOrStaffMiddleware, updateNews)

//Xóa nhiều bài viết (yêu cầu admin hoặc staff)
router.delete('/many', authMiddleware, adminOrStaffMiddleware, deleteNewsMany)

// Xóa bài viết (yêu cầu admin hoặc staff)
router.delete('/:id', authMiddleware, adminOrStaffMiddleware, deleteNews)

// Khôi phục bài viết (yêu cầu admin hoặc staff)
router.patch('/:id/restore', authMiddleware, adminOrStaffMiddleware, restoreNews)

// Xóa vĩnh viễn bài viết (yêu cầu admin hoặc staff)
router.delete('/:id/permanent', authMiddleware, adminOrStaffMiddleware, permanentDeleteNews)

module.exports = router
