const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Tên dịch vụ là bắt buộc"],
    trim: true,
    minLength: [3, "Tên dịch vụ phải có ít nhất 3 ký tự"],
    maxLength: [100, "Tên dịch vụ không được vượt quá 100 ký tự"],
  },
  description: {
    type: [String],
    required: [true, "Mô tả dịch vụ là bắt buộc"],
    validate: {
      validator: function (arr) {
        return (
          Array.isArray(arr) &&
          arr.length > 0 &&
          arr.every((item) => item.trim().length > 0)
        );
      },
      message: "Phải có ít nhất một mô tả và không được để trống",
    },
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
