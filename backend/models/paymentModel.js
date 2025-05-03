const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: [true, "ID đơn hàng là bắt buộc"],
    validate: {
      validator: async function (v) {
        const order = await mongoose.model("Order").findById(v);
        return !!order;
      },
      message: "Đơn hàng không tồn tại",
    },
  },
  method: {
    type: String,
    enum: {
      values: ["MOMO", "VNPAY", "BANK_TRANSFER"],
      message: "Phương thức thanh toán phải là 'MOMO', 'VNPAY'",
    },
    required: [true, "Phương thức thanh toán là bắt buộc"],
  },
  status: {
    type: String,
    enum: {
      values: ["pending", "paid", "failed"],
      message: "Trạng thái thanh toán phải là 'pending', 'paid', hoặc 'failed'",
    },
    default: "pending",
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
