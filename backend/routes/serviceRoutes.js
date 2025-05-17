const express = require('express')
const router = express.Router()
const upload = require('../middleware/uploadImage')

const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  uploadServiceImage,
  restoreService,
  permanentDeleteService,
} = require('../controllers/serviceController')
const adminMiddleware = require('../middleware/adminMiddleware')
const authMiddleware = require('../middleware/authMiddleware')

// Routes công khai
router.get('/', getServices)
router.get('/:id', getServiceById)

// Route upload ảnh
router.post('/upload', authMiddleware, adminMiddleware, upload.single('image'), uploadServiceImage)

// Routes yêu cầu quyền admin
router.post('/', authMiddleware, adminMiddleware, createService)
router.put('/:id', authMiddleware, adminMiddleware, updateService)
router.delete('/:id', authMiddleware, adminMiddleware, deleteService)
router.patch('/:id/restore', authMiddleware, adminMiddleware, restoreService)
router.delete('/:id/permanent', authMiddleware, adminMiddleware, permanentDeleteService)

// Route upload ảnh
router.post('/upload', authMiddleware, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Không có file được tải lên',
      })
    }

    // Trả về đường dẫn tương đối của file
    const imagePath = req.file.path.replace(/\\/g, '/') // Chuẩn hóa đường dẫn cho Windows
    res.status(200).json({
      success: true,
      imagePath,
      message: 'Tải ảnh lên thành công',
    })
  } catch (error) {
    console.error('Error uploading image:', error)
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tải ảnh lên',
    })
  }
})
module.exports = router
