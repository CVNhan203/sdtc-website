const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash mật khẩu trước khi lưu
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Phương thức so sánh mật khẩu
adminSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Admin = mongoose.model('Admin', adminSchema);

// Tạo admin mặc định nếu chưa tồn tại
const createDefaultAdmin = async () => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      await Admin.create({
        email: "admin@gmail.com",
        password: "Admin123"
      });
      console.log('Tạo tài khoản admin mặc định thành công');
    }
  } catch (error) {
    console.error('Lỗi khi tạo tài khoản admin mặc định:', error);
  }
};

// Tự động tạo admin mặc định khi khởi động
createDefaultAdmin();

module.exports = Admin;
