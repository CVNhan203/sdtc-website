const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Họ và tên là bắt buộc"],
    trim: true,
    minlength: [5, "Họ và tên phải có ít nhất 3 ký tự"],
    maxlength: [50, "Họ và tên không được vượt quá 50 ký tự"],
    match: [/^[a-zA-Z\s]/, "Họ và tên chỉ được chứa chữ cái và khoảng trắng"],
  },
  phone: {
    type: String,
    required: [true, "Số điện thoại là bắt buộc"],
    trim: true,
    validate: {
      validator: function (v) {
        // Định dạng số điện thoại Việt Nam: bắt đầu bằng 0, theo sau là 9-10 chữ số
        return /^(0[35789][0-9]{8})$/.test(v);
      },
      message:
        "Số điện thoại không hợp lệ, phải bắt đầu bằng 03, 05, 07, 08, hoặc 09 và có 10 chữ số",
    },
  },
  email: {
    type: String,
    required: [true, "Email là bắt buộc"],
    trim: true,
    lowercase: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Vui lòng nhập email hợp lệ (ví dụ: nam.vuphanhoai@gmail.com)",
    ],
  },
  service: {
    type: String,
    required: [true, "Tên dịch vụ là bắt buộc"],
    trim: true,
    minlength: [3, "Tên dịch vụ phải có ít nhất 3 ký tự"],
    maxlength: [50, "Tên dịch vụ không được vượt quá 50 ký tự"],
    match: [
      /^[a-zA-Z0-9\s]/,
      "Tên dịch vụ chỉ được chứa chữ cái, số và khoảng trắng",
    ],
  },
  note: {
    type: String,
    trim: true,
    default: "",
    maxlength: [500, "Ghi chú không được vượt quá 500 ký tự"],
  },
  status: {
    type: String,
    enum: {
      values: ["processing", "completed", "cancelled"],
      message: "Trạng thái phải là 'processing', 'completed', hoặc 'cancelled'",
    },
    default: "processing",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
