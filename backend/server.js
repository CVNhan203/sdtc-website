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

const app = express()
const port = process.env.PORT || 3000

// Connect to MongoDB
connectDB()

// Middleware
app.use(express.json())

// Cấu hình CORS cho phép frontend truy cập API
app.use(cors({
  origin: ['http://localhost:8080', 'http://127.0.0.1:8080', 'http://192.168.2.34:8080'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Định nghĩa BASE_URL cho server - sử dụng địa chỉ IP
const BASE_URL = 'http://192.168.2.34:3000'
app.locals.BASE_URL = BASE_URL
console.log('Server BASE_URL:', BASE_URL)

// Cấu hình để phục vụ tệp tĩnh từ thư mục uploads
const uploadsPath = path.join(__dirname, 'uploads')
console.log('Thư mục uploads đầy đủ:', uploadsPath)

app.use('/uploads', (req, res, next) => {
  // Thêm CORS headers cho file tĩnh
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  // Log yêu cầu để debug
  console.log('Request to static file:', req.url);
  
  // Thiết lập Content-Type nếu là hình ảnh
  if (req.url.match(/\.(jpg|jpeg|png|gif)$/i)) {
    const ext = path.extname(req.url).toLowerCase();
    let contentType = 'image/jpeg';
    if (ext === '.png') contentType = 'image/png';
    if (ext === '.gif') contentType = 'image/gif';
    res.setHeader('Content-Type', contentType);
  }
  
  express.static(uploadsPath)(req, res, next);
});

// Đảm bảo đường dẫn cụ thể cho hình ảnh
const imagesPath = path.join(__dirname, 'uploads', 'images')
console.log('Thư mục images đầy đủ:', imagesPath)

app.use('/uploads/images', (req, res, next) => {
  // Thêm CORS headers cho file tĩnh
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  // Log yêu cầu để debug
  console.log('Request to image:', req.url);
  
  // Thiết lập Content-Type nếu là hình ảnh
  if (req.url.match(/\.(jpg|jpeg|png|gif)$/i)) {
    const ext = path.extname(req.url).toLowerCase();
    let contentType = 'image/jpeg';
    if (ext === '.png') contentType = 'image/png';
    if (ext === '.gif') contentType = 'image/gif';
    res.setHeader('Content-Type', contentType);
  }
  
  express.static(imagesPath)(req, res, next);
});

// In ra một số đường dẫn ảnh mẫu để kiểm tra
const sampleImage = path.join(__dirname, 'uploads', 'images', '1746862099720.png')
console.log('Sample image path:', sampleImage)
console.log('Sample image URL:', `${BASE_URL}/uploads/images/1746862099720.png`)

// Routes
app.use('/api/emails', emailRoutes)
app.use('/api/news', newsRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/bookings', bookingRoutes)

// Admin routes
app.use('/api/admin', adminRoutes)

// Thêm route kiểm tra trực tiếp cho hình ảnh
app.get('/test-image/:filename', (req, res) => {
  const filename = req.params.filename
  const imagePath = path.join(uploadsPath, 'images', filename)
  
  console.log('Testing image path:', imagePath)
  
  // Kiểm tra file tồn tại
  if (require('fs').existsSync(imagePath)) {
    res.sendFile(imagePath)
  } else {
    res.status(404).send('Image not found')
  }
})

// Bổ sung route để kiểm tra tệp tĩnh
app.get('/check-image/:filename', (req, res) => {
  const filename = req.params.filename
  const imagePath = path.join(uploadsPath, 'images', filename)
  
  // Kiểm tra file tồn tại
  if (require('fs').existsSync(imagePath)) {
    res.json({ exists: true, path: imagePath, url: `${BASE_URL}/uploads/images/${filename}` })
  } else {
    res.json({ exists: false })
  }
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Server đang chạy tại ${BASE_URL}`)
})
