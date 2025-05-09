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
  getTrashNews
} = require('../controllers/newsController')

const adminMiddleware = require('../middleware/adminMiddleware')
const authMiddleware = require('../middleware/authMiddleware')
const adminOrStaffMiddleware = require('../middleware/adminOrStaffMiddleware')

// Routes công khai
router.get('/', getNews)

// Routes yêu cầu xác thực Admin hoặc Staff
router.use(authMiddleware)
router.use(adminOrStaffMiddleware)

// Route cho thùng rác phải đặt trước các route có pattern /:id
router.get('/trash', getTrashNews)

// Routes upload
router.post('/upload', upload.single('image'), uploadNewsImage)

// Routes thao tác nhiều items
router.post('/delete-many', deleteNewsMany)

// Routes CRUD cơ bản
router.post('/', createNews)
router.get('/:id', getNewsById)
router.put('/:id', updateNews)
router.delete('/:id', deleteNews)
router.patch('/:id/restore', restoreNews)
router.delete('/:id/permanent', permanentDeleteNews)

module.exports = router
