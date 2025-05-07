const express = require('express')
const router = express.Router()
const upload = require('../middleware/uploadImage')

const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController')
const adminMiddleware = require('../middleware/adminMiddleware')
const authMiddleware = require('../middleware/authMiddleware')

// Routes công khai
router.get('/', getServices)
router.get('/:id', getServiceById)

// Routes yêu cầu quyền admin
router.post('/', authMiddleware, adminMiddleware, createService)
router.put('/:id', authMiddleware, adminMiddleware, updateService)
router.delete('/:id', authMiddleware, adminMiddleware, deleteService)

module.exports = router
