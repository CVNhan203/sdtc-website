const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Tên dịch vụ là bắt buộc"],
    trim: true,
    minlength: [3, "Tên dịch vụ phải có ít nhất 3 ký tự"],
    maxlength: [100, "Tên dịch vụ không được vượt quá 100 ký tự"],
    match: [
      /^[a-zA-Z0-9\s[\]{}()!@#$%^&*,.?-]+$/,
      "Tên dịch vụ chứa ký tự không hợp lệ",
    ],
    unique: [true, "Tên dịch vụ đã tồn tại"],
  },
  description: {
    type: [String],
    required: [true, "Mô tả dịch vụ là bắt buộc"],
    validate: [
      {
        validator: function (arr) {
          return Array.isArray(arr) && arr.length > 0;
        },
        message: "Phải có ít nhất một mô tả dịch vụ",
      },
      {
        validator: function (arr) {
          return arr.every(
            (item) => item.trim().length >= 10 && item.trim().length <= 500
          );
        },
        message: "Mỗi mô tả phải có từ 10 đến 500 ký tự",
      },
    ],
  },
  price: {
    type: Number,
    required: [true, "Giá dịch vụ là bắt buộc"],
    min: [0, "Giá dịch vụ không được âm"],
  },
  image: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    required: [true, "Loại dịch vụ là bắt buộc"],
    enum: {
      values: ["web", "app", "agency"],
      message: "Loại dịch vụ phải là một trong các giá trị: web, app, agency",
    },
    trim: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});
module.exports = mongoose.model("Service", serviceSchema);
