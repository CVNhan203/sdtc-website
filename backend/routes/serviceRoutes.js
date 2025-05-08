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
  permanentDeleteService
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

module.exports = router
