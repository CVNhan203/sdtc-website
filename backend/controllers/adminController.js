const Admin = require('../models/adminModel')
const Order = require('../models/orderModel')
const Payment = require('../models/paymentModel')
const Service = require('../models/serviceModel')
const News = require('../models/newsModel')
const Booking = require('../models/bookingModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

// Đăng nhập admin
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const admin = await Admin.findOne({ email })
  if (!admin)
    return res.status(401).json({ success: false, message: 'Sai tài khoản hoặc mật khẩu' })
  const isMatch = await bcrypt.compare(password, admin.password)
  if (!isMatch)
    return res.status(401).json({ success: false, message: 'Sai tài khoản hoặc mật khẩu' })
  // Tạo token
  const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '1h',
  })
  res.json({
    success: true,
    token,
    admin: { fullName: admin.fullName, email: admin.email, role: admin.role },
  })
})

// Thống kê dashboard
exports.getDashboardStats = asyncHandler(async (req, res) => {

  const [orderCount, paymentCount, serviceCount, newsCount, bookingsCount, adminCount] =
    await Promise.all([
      Order.countDocuments(),
      Payment.countDocuments(),
      Service.countDocuments(),
      News.countDocuments(),
      Booking.countDocuments(),
      Admin.countDocuments({ role: 'staff', isDeleted: { $ne: true } }),
    ])
  res.json({
    success: true,
    data: {
      orders: orderCount,
      payments: paymentCount,
      services: serviceCount,
      news: newsCount,
      bookings: bookingsCount,

      admins: adminCount,
    },
  })
})

// Lấy danh sách staff
exports.getStaffs = asyncHandler(async (req, res) => {
  const staffs = await Admin.find({ role: 'staff', isDeleted: { $ne: true } }).select('-password')
  res.json({ success: true, data: staffs })
})

// Lấy danh sách staff đã xóa mềm
exports.getDeletedStaffs = asyncHandler(async (req, res) => {
  const deletedStaffs = await Admin.find({ role: 'staff', isDeleted: true }).select('-password')
  res.json({ success: true, data: deletedStaffs })
})

// Tạo staff
exports.createStaff = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body
  const staff = new Admin({ fullName, email, password, role: 'staff' })
  await staff.save()
  res.status(201).json({ success: true, data: staff })
})
// Lấy chi tiết staff
exports.getStaffById = asyncHandler(async (req, res) => {
  const { id } = req.params
  const staff = await Admin.findOne({ _id: id, role: 'staff', isDeleted: { $ne: true } }).select(
    '-password'
  )
  if (!staff) return res.status(404).json({ success: false, message: 'Không tìm thấy staff' })
  res.json({ success: true, data: staff })
})

// Cập nhật staff
exports.updateStaff = asyncHandler(async (req, res) => {
  const { id } = req.params
  const updateData = req.body
  if (updateData.password) delete updateData.password // Không cho update password ở đây
  const staff = await Admin.findOneAndUpdate({ _id: id, role: 'staff' }, updateData, { new: true })
  if (!staff) return res.status(404).json({ success: false, message: 'Không tìm thấy staff' })
  res.json({ success: true, data: staff })
})

//Xóa staff (đánh dấu là đã xóa)
exports.deleteStaff = asyncHandler(async (req, res) => {
  const { id } = req.params
  // Kiểm tra xem có yêu cầu xóa vĩnh viễn hay không
  const { permanent } = req.query

  if (permanent === 'true') {
    // Xóa vĩnh viễn
    const staff = await Admin.findOneAndDelete({ _id: id, role: 'staff' })
    if (!staff) return res.status(404).json({ success: false, message: 'Không tìm thấy staff' })
    return res.json({ success: true, message: 'Đã xóa vĩnh viễn staff thành công' })
  }

  // Xóa mềm
  const staff = await Admin.findOneAndUpdate(
    { _id: id, role: 'staff' },
    { $set: { isDeleted: true } },
    { new: true }
  )
  if (!staff) return res.status(404).json({ success: false, message: 'Không tìm thấy staff' })
  res.json({ success: true, message: 'Đã ẩn staff thành công' })
})
