const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: [true, "Gói dịch vụ là bắt buộc"],
  },
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
      validator: function (v) {
        return /^0\d{9,10}$/.test(v);
      },
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
  paymentMethod: {
    type: String,
    enum: ["MOMO", "VNPAY"],
    required: [true, "Phương thức thanh toán là bắt buộc"],
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  orderStatus: {
    type: String,
    enum: ["pending", "processing", "completed", "cancelled"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
