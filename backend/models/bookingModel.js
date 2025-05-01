const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Họ và tên là bắt buộc"],
    trim: true,
    minLength: [3, "Họ và tên phải có ít nhất 3 ký tự"],
    maxLength: [50, "Họ và tên không được vượt quá 50 ký tự"],
  },
  phone: {
    type: String,
    required: [true, "Số điện thoại là bắt buộc"],
    validate: {
      validator: (v) => /^0\d{9,10}$/.test(v),
      message: "Số điện thoại không hợp lệ",
    },
  },
  email: {
    type: String,
    required: [true, "Email là bắt buộc"],
    trim: true,
    lowercase: true,
    match: [/.+@.+\..+/, "Email không hợp lệ"],
  },
  service: {
    type: String,
    required: [true, "Tên dịch vụ là bắt buộc"],
    trim: true,
    minLength: [3, "Tên dịch vụ phải có ít nhất 3 ký tự"],
    maxLength: [50, "Tên dịch vụ không được vượt quá 50 ký tự"],
  },
  note: {
    type: String,
    trim: true,
    default: "",
  },
  status: {
    type: String,
    enum: ["processing", "completed", "cancelled"],
    default: "processing",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
