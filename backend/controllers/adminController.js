const Admin = require("../models/adminModel");
const Order = require("../models/orderModel");
const Payment = require("../models/paymentModel");
const Service = require("../models/serviceModel");
const News = require("../models/newsModel");
const Booking = require("../models/bookingModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

// Đăng nhập admin
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin)
    return res
      .status(401)
      .json({ success: false, message: "Sai tài khoản hoặc mật khẩu" });
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch)
    return res
      .status(401)
      .json({ success: false, message: "Sai tài khoản hoặc mật khẩu" });
  // Tạo token
  const token = jwt.sign(
    { id: admin._id, role: admin.role },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "1h" }
  );
  res.json({
    success: true,
    token,
    admin: { fullName: admin.fullName, email: admin.email, role: admin.role },
  });
});

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
    ]);

  // Dữ liệu cho biểu đồ đơn hàng theo tháng
  const currentDate = new Date();
  const ordersChartData = [];
  const ordersChartLabels = [];
  
  // Lấy dữ liệu 6 tháng gần nhất
  for (let i = 5; i >= 0; i--) {
    const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthName = `T${month.getMonth() + 1}`;
    ordersChartLabels.push(monthName);
    
    const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
    const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    
    const count = await Order.countDocuments({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    });
    
    ordersChartData.push(count);
  }

  // Dữ liệu cho biểu đồ phân bổ dịch vụ theo loại
  const services = await Service.find().select('serviceType');
  const serviceDistribution = {};
  
  services.forEach(service => {
    if (serviceDistribution[service.serviceType]) {
      serviceDistribution[service.serviceType]++;
    } else {
      serviceDistribution[service.serviceType] = 1;
    }
  });
  
  const servicesDistribution = Object.keys(serviceDistribution).map(key => ({
    name: key,
    value: serviceDistribution[key]
  }));
  
  // Dữ liệu hoạt động gần đây
  const recentActivities = [];
  
  // Lấy đơn hàng gần đây
  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(2);
    
  recentOrders.forEach(order => {
    recentActivities.push({
      type: 'order',
      title: `Đơn hàng mới <span class="highlight">#${order._id.toString().slice(-5)}</span>`,
      time: formatTime(order.createdAt)
    });
  });
  
  // Lấy thanh toán gần đây
  const recentPayments = await Payment.find()
    .sort({ createdAt: -1 })
    .limit(2);
    
  recentPayments.forEach(payment => {
    recentActivities.push({
      type: 'payment',
      title: `Thanh toán thành công <span class="highlight">${payment.amount.toLocaleString()} VNĐ</span>`,
      time: formatTime(payment.createdAt)
    });
  });
  
  // Lấy tin tức gần đây
  const recentNews = await News.find()
    .sort({ createdAt: -1 })
    .limit(1);
    
  recentNews.forEach(news => {
    recentActivities.push({
      type: 'news',
      title: `Tin tức mới <span class="highlight">${news.title}</span>`,
      time: formatTime(news.createdAt)
    });
  });
  
  // Sắp xếp hoạt động theo thời gian
  recentActivities.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  
  // Tính xu hướng so với tháng trước
  const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  const endOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const endOfPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
  
  // Tính số đơn hàng tháng này và tháng trước
  const [currentMonthOrders, previousMonthOrders] = await Promise.all([
    Order.countDocuments({
      createdAt: { $gte: currentMonth, $lte: endOfCurrentMonth }
    }),
    Order.countDocuments({
      createdAt: { $gte: previousMonth, $lte: endOfPreviousMonth }
    })
  ]);
  
  // Tính phần trăm thay đổi
  const ordersTrend = previousMonthOrders === 0 
    ? 100 
    : Math.round((currentMonthOrders - previousMonthOrders) / previousMonthOrders * 100);
  
  // Trả về đầy đủ dữ liệu
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
  });
});

// Lấy danh sách staff
exports.getStaffs = asyncHandler(async (req, res) => {
  const staffs = await Admin.find({ role: 'staff', isDeleted: { $ne: true } }).select('-password');
  res.json({ success: true, data: staffs });
});

// Tạo staff
exports.createStaff = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;
  const staff = new Admin({ fullName, email, password, role: 'staff' });
  await staff.save();
  res.status(201).json({ success: true, data: staff });
});
// Lấy chi tiết staff
exports.getStaffById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const staff = await Admin.findOne({ _id: id, role: 'staff', isDeleted: { $ne: true} }).select('-password');
  if (!staff) return res.status(404).json({ success: false, message: 'Không tìm thấy staff' });
  res.json({ success: true, data: staff });
});

// Cập nhật staff
exports.updateStaff = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  if (updateData.password) delete updateData.password; // Không cho update password ở đây
  const staff = await Admin.findOneAndUpdate({ _id: id, role: 'staff' }, updateData, { new: true });
  if (!staff) return res.status(404).json({ success: false, message: 'Không tìm thấy staff' });
  res.json({ success: true, data: staff });
});

//Xóa staff (đánh dấu là đã xóa)
exports.deleteStaff = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const staff = await Admin.findOneAndUpdate(
    { _id: id, role: 'staff' },
    { $set: { isDeleted: true } },
    { new: true }
  );
  if (!staff) return res.status(404).json({ success: false, message: 'Không tìm thấy staff' });
  res.json({ success: true, message: 'Đã ẩn staff thành công' });
});
