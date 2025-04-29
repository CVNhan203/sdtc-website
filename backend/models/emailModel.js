const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  to: {
    type: String,
    required: [true, 'Email người nhận là bắt buộc'],
    match: [/.+@.+\..+/, 'Email không hợp lệ']
  },
  subject: {
    type: String,
    required: [true, 'Tiêu đề là bắt buộc']
  },
  html: {
    type: String,
    required: [true, 'Nội dung email là bắt buộc']
  },
  sentAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Email', emailSchema);
