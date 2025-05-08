const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Tên dịch vụ là bắt buộc'],
    trim: true,
    minlength: [3, 'Tên dịch vụ phải có ít nhất 3 ký tự'],
    maxlength: [100, 'Tên dịch vụ không được vượt quá 100 ký tự'],
  },
  description: {
    // Cho phép description là một chuỗi hoặc một mảng các chuỗi
    type: [String],
    required: [true, 'Mô tả dịch vụ là bắt buộc'],
    validate: [
      {
        validator: function (arr) {
          // Kiểm tra nếu là một mảng và có ít nhất một phần tử
          return Array.isArray(arr) && arr.length > 0
        },
        message: 'Phải có ít nhất một mô tả dịch vụ',
      },
      {
        validator: function (arr) {
          // Giảm yêu cầu về độ dài tối thiểu xuống 1 ký tự
          return arr.every((item) => {
            const trimmed = item.trim()
            return trimmed.length >= 1 && trimmed.length <= 1000
          })
        },
        message: 'Mỗi mô tả không được rỗng và không được vượt quá 1000 ký tự',
      },
    ],
  },
  price: {
    type: Number,
    required: [true, 'Giá dịch vụ là bắt buộc'],
    min: [0, 'Giá dịch vụ không được âm'],
  },
  image: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    required: [true, 'Loại dịch vụ là bắt buộc'],
    enum: {
      values: ['web', 'app', 'agency'],
      message: 'Loại dịch vụ phải là một trong các giá trị: web, app, agency',
    },
    trim: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
})
module.exports = mongoose.model('Service', serviceSchema)
