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
} = require('../controllers/newsController')

const adminOrStaffMiddleware = require('../middleware/adminOrStaffMiddleware')
const authMiddleware = require('../middleware/authMiddleware')

// Lấy danh sách bài viết (công khai)
router.get('/', getNews)

// Route upload ảnh
router.post('/upload', authMiddleware, adminOrStaffMiddleware, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Không có file được tải lên'
      })
    }

    // Trả về đường dẫn tương đối của file
    const imagePath = req.file.path.replace(/\\/g, '/') // Chuẩn hóa đường dẫn cho Windows
    res.status(200).json({
      success: true,
      imagePath,
      message: 'Tải ảnh lên thành công'
    })
  } catch (error) {
    console.error('Error uploading image:', error)
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tải ảnh lên'
    })
  }
})

// Lấy chi tiết bài viết theo ID
router.get('/:id', getNewsById)

// Tạo bài viết mới (yêu cầu đăng nhập + quyền admin/staff)
router.post('/', authMiddleware, adminOrStaffMiddleware, createNews)

// Cập nhật bài viết (yêu cầu đăng nhập + quyền admin/staff)
router.put('/:id', authMiddleware, adminOrStaffMiddleware, updateNews)

// Xóa bài viết (yêu cầu đăng nhập + quyền admin/staff)
router.delete('/:id', authMiddleware, adminOrStaffMiddleware, deleteNews)

// Xóa nhiều bài viết (yêu cầu đăng nhập + quyền admin/staff)
router.delete('/', authMiddleware, adminOrStaffMiddleware, deleteNewsMany)

module.exports = router