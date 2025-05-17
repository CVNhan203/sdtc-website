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
    minlength: [2, "Họ và tên phải có ít nhất 2 ký tự"],
    maxlength: [50, "Họ và tên không được vượt quá 50 ký tự"],
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
      "Vui lòng nhập email hợp lệ (ví dụ: sanhdepchoai@gmail.com)",
    ],
  },
  paymentMethod: {
    type: String,
    enum: ["MOMO", "VNPAY"],
    required: [true, "Phương thức thanh toán phải là 'MOMO', 'VNPAY'"],
  },
  paymentStatus: {
    type: String,
    enum: {
      values: ["pending", "paid", "failed"],
      message: "Trạng thái thanh toán phải là 'pending', 'paid', hoặc 'failed'",
    },
    default: "pending",
  },
  paymentAmount: {
    type: Number,
    default: 0,
  },
  paymentDate: {
    type: Date,
  },
  paymentTransactionId: {
    type: String,
    trim: true,
  },
  orderStatus: {
    type: String,
    enum: {
      values: ["pending", "processing", "completed", "cancelled"],
      message:
        "Trạng thái đơn hàng phải là 'pending', 'processing', 'completed', hoặc 'cancelled'",
    },
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware để cập nhật updatedAt trước khi lưu
orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Middleware để cập nhật updatedAt trước khi cập nhật
orderSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

module.exports = mongoose.model("Order", orderSchema);
