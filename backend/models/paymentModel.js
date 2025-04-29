const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: [true, "orderId là bắt buộc"],
  },
  method: {
    type: String,
    enum: ["MOMO", "VNPAY"],
    required: [true, "Phương thức thanh toán là bắt buộc"],
  },
  status: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
