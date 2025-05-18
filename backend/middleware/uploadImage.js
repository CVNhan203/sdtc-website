const multer = require('multer')
const path = require('path')
const fs = require('fs')

// Đảm bảo thư mục uploads/images trong backend tồn tại
const uploadDir = path.join(__dirname, '..', 'uploads/images')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
  console.log(`Đã tạo thư mục ${uploadDir}`)
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir) // Thư mục lưu ảnh trong backend
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) // Tên file duy nhất
  },
})

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Chỉ cho phép upload các file ảnh
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Chỉ chấp nhận file hình ảnh!'), false)
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // giới hạn 10MB
  }
})

module.exports = upload
