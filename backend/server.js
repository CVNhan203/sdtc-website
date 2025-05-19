require('dotenv').config()
const express = require('express')
const connectDB = require('./config/db')
const cors = require('cors')
const path = require('path')
const emailRoutes = require('./routes/emailRoutes')
const newsRoutes = require('./routes/newsRoutes')
const orderRoutes = require('./routes/orderRoutes')
const serviceRoutes = require('./routes/serviceRoutes')
const bookingRoutes = require('./routes/bookingRoutes')
const adminRoutes = require('./routes/adminRoutes')
const fs = require('fs')

const app = express()
const port = process.env.PORT || 3000

// Connect to MongoDB
connectDB()

// Middleware
app.use(express.json())

// Cấu hình CORS cho phép frontend truy cập API
app.use(cors({
  origin: ['https://tansanh.github.io','http://localhost:8080', 'http://127.0.0.1:8080', 'http://localhost:8080'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Tạo BASE_URL cho server - để đảm bảo đường dẫn ảnh hoạt động đúng
const BASE_URL = `http://localhost:${port}`
app.locals.BASE_URL = BASE_URL

// Cấu hình để phục vụ tệp tĩnh từ thư mục uploads
const uploadsPath = path.join(__dirname, 'uploads')

app.use('/uploads', (req, res, next) => {
  // Thêm CORS headers cho file tĩnh
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
  
  // Cấu hình kiểm soát cache để đảm bảo ảnh luôn được cập nhật
  res.setHeader('Cache-Control', 'no-cache, max-age=0, must-revalidate, no-store');
  res.setHeader('Expires', '0');
  res.setHeader('Pragma', 'no-cache');
  
  // Thiết lập Content-Type nếu là hình ảnh
  if (req.url.match(/\.(jpg|jpeg|png|gif)$/i)) {
    const ext = path.extname(req.url).toLowerCase();
    let contentType = 'image/jpeg';
    if (ext === '.png') contentType = 'image/png';
    if (ext === '.gif') contentType = 'image/gif';
    res.setHeader('Content-Type', contentType);
  }
  
  next();
}, express.static(uploadsPath));

// Đảm bảo các thư mục uploads tồn tại
const imagesDir = path.join(uploadsPath, 'images')
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true })
}
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true })
}

// Routes
app.use('/api/emails', emailRoutes)
app.use('/api/news', newsRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/bookings', bookingRoutes)

// Admin routes
app.use('/api/admin', adminRoutes)

// Xử lý lỗi 404 - khi không tìm thấy route
app.use((req, res, next) => {
  res.status(404).json({
    message: 'Route not found',
  })
})

// Error middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  })
})

const server = app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`)
})

// Xử lý khi bị crash
process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason)
  // Đóng server gracefully
  server.close(() => {
    process.exit(1)
  })
})
