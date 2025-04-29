const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Tên là bắt buộc"],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Mật khẩu là bắt buộc"],
  },
  email: {
    type: String,
    required: [true, "Email đăng nhập là bắt buộc"],
    unique: true,
    trim: true,
    match: [/.+@.+\..+/, "Email không hợp lệ"],
  },
  role: {
    type: String,
    enum: ["admin"],
    default: "admin",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Admin", adminSchema);
