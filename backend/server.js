require('dotenv').config()
const express = require('express')
const connectDB = require('./config/db')
const cors = require('cors')
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
app.use(
  cors({
    origin: '*', // Cho phép tất cả các nguồn truy cập
    credentials: true, // Nếu cần gửi cookie, xác thực
  })
)

// Cho phép truy cập thư mục uploads
app.use('/uploads', express.static('uploads'))

// Routes
app.use('/api/emails', emailRoutes)
app.use('/api/news', newsRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/bookings', bookingRoutes)

// Admin routes
app.use('/api/admin', adminRoutes)

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`)
})
