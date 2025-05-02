const mongoose = require('mongoose');

// Tạo custom validator để kiểm tra không có khoảng trắng đầu chuỗi
const noLeadingWhitespace = {
  validator: function(v) {
    if (typeof v !== 'string') return true; // Bỏ qua nếu không phải chuỗi
    return !/^\s/.test(v);
  },
  message: 'Không được bắt đầu bằng dấu cách'
};

// Tạo custom validator để kiểm tra không chứa emoji
const noEmoji = {
  validator: function(v) {
    if (typeof v !== 'string') return true;
    return !/\p{Emoji}/u.test(v);
  },
  message: 'Không được chứa emoji'
};

const emailSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, 'Họ tên là bắt buộc'],
    trim: true,
    minlength: [2, 'Họ tên phải có ít nhất 2 ký tự'],
    maxlength: [100, 'Họ tên không được vượt quá 100 ký tự'],
    validate: [
      {
        validator: function(v) {
          return /^[a-zA-ZÀ-ỹ\s\-']+$/u.test(v);
        },
        message: 'Họ tên chỉ được chứa chữ cái, dấu gạch nối và không chứa số hoặc ký tự đặc biệt'
      },
      noLeadingWhitespace,
      noEmoji
    ]
  },
  phone: {
    type: String,
    required: [true, 'Số điện thoại là bắt buộc'],
    trim: true,
    minlength: [10, 'Số điện thoại tối thiểu 10 số'],
    maxlength: [15, 'Số điện thoại tối đa 15 số'],
    validate: [
      {
        validator: function(v) {
          return /^\+?[0-9]{10,15}$/.test(v);
        },
        message: 'Số điện thoại không hợp lệ (phải từ 10 đến 15 số, có thể bắt đầu bằng dấu +)'
      },
      noLeadingWhitespace
    ]
  },
  email: {
    type: String,
    required: [true, 'Email là bắt buộc'],
    trim: true,
    lowercase: true,
    validate: [
      {
        validator: function(v) {
          if (!v) return false;
          return /^[^\s@]+@gmail\.com$/.test(v.trim());
        },
        message: 'Email không hợp lệ. Chỉ chấp nhận địa chỉ @gmail.com'
      }
    ]
  },
  demand: {
    type: String,
    required: [true, 'Nhu cầu tư vấn là bắt buộc'],
    trim: true,
    maxlength: [100, 'Nhu cầu tư vấn không được vượt quá 100 ký tự']
  },
  note: {
    type: String,
    trim: true,
    maxlength: [1000, 'Ghi chú không được vượt quá 1000 ký tự']
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'completed', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Email = mongoose.model('Email', emailSchema);

module.exports = Email;
