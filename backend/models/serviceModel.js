const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  image: {
    type: String,
    required: [true, "Hình ảnh dịch vụ là bắt buộc"],
    trim: true,
  },
  title: {
    type: String,
    required: [true, "Tên dịch vụ là bắt buộc"],
    trim: true,
    minLength: [3, "Tên dịch vụ phải có ít nhất 3 ký tự"],
    maxLength: [100, "Tên dịch vụ không được vượt quá 100 ký tự"],
  },
  price: {
    type: Number,
    required: [true, "Giá dịch vụ là bắt buộc"],
    min: [0, "Giá dịch vụ không được âm"],
    validate: {
      validator: function (value) {
        return value > 0;
      },
      message: "Giá dịch vụ phải lớn hơn 0",
    },
  },
  description: {
    type: [String],
    required: [true, "Mô tả dịch vụ là bắt buộc"],
    validate: {
      validator: function (array) {
        return (
          array &&
          array.length > 0 &&
          array.every((item) => item.trim().length > 0)
        );
      },
      message: "Phải có ít nhất một mô tả và không được để trống",
    },
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
});

module.exports = mongoose.model("Service", serviceSchema);
