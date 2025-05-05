const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
  to: {
    type: String,
    required: [true, "Email người nhận là bắt buộc"],
    trim: true,
    lowercase: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Vui lòng nhập email hợp lệ (ví dụ: nam.vuphanhoai@gmail.com)",
    ],
  },
  subject: {
    type: String,
    required: [true, "Tiêu đề email là bắt buộc"],
    trim: true,
    minlength: [3, "Tiêu đề phải có ít nhất 3 ký tự"],
    maxlength: [100, "Tiêu đề không được vượt quá 100 ký tự"],
  },
  html: {
    type: String,
    required: [true, "Nội dung email là bắt buộc"],
    trim: true,
    minlength: [10, "Nội dung email phải có ít nhất 10 ký tự"],
    maxlength: [10000, "Nội dung email không được vượt quá 10,000 ký tự"],
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Email", emailSchema);
