const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const staffSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Tên nhân viên là bắt buộc"],
    trim: true,
    minlength: [3, "Tên phải có ít nhất 3 ký tự"],
    maxlength: [50, "Tên không được vượt quá 50 ký tự"],
  },
  email: {
    type: String,
    required: [true, "Email là bắt buộc"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Vui lòng nhập email hợp lệ"],
  },
  password: {
    type: String,
    required: [true, "Mật khẩu là bắt buộc"],
    minlength: [6, "Mật khẩu phải có ít nhất 6 ký tự"],
    select: false,
  },
  role: {
    type: String,
    default: "staff",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Mã hóa mật khẩu trước khi lưu
staffSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Phương thức so sánh mật khẩu
staffSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Staff", staffSchema); 