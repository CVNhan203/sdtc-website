const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, 'Họ tên là bắt buộc'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Số điện thoại là bắt buộc'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^[0-9]{10}$/.test(v);
      },
      message: 'Số điện thoại không hợp lệ'
    }
  },
  email: {
    type: String,
    required: [true, 'Email là bắt buộc'],
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Email không hợp lệ'
    }
  },
  demand: {
    type: String,
    required: [true, 'Nhu cầu là bắt buộc'],
    enum: {
      values: ['Website', 'App', 'Agency'],
      message: 'Nhu cầu phải là một trong các giá trị: Website, App, Agency'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'completed', 'cancelled'],
    default: 'pending'
  },
  note: {
    type: String,
    default: ''
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
