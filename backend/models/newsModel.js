const mongoose = require('mongoose')

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Tiêu đề bài viết là bắt buộc'],
    trim: true,
    minLength: [10, 'Tiêu đề phải có ít nhất 10 ký tự'],
    maxLength: [200, 'Tiêu đề không được vượt quá 200 ký tự'],
  },
  summary: {
    type: String,
    required: [true, 'Tóm tắt bài viết là bắt buộc'],
    trim: true,
    minLength: [20, 'Tóm tắt phải có ít nhất 20 ký tự'],
    maxLength: [500, 'Tóm tắt không được vượt quá 500 ký tự'],
  },
  content: {
    type: String,
    required: [true, 'Nội dung bài viết là bắt buộc'],
    trim: true,
    minLength: [100, 'Nội dung phải có ít nhất 100 ký tự'],
  },
  image: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    required: [true, 'Loại bài viết là bắt buộc'],
  },
  publishedDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  author: {
    type: String,
    default: 'Admin',
    trim: true,
    minlength: [3, 'Tên tác giả phải có ít nhất 3 ký tự'],
    maxlength: [50, 'Tên tác giả không được vượt quá 50 ký tự'],
    match: [/^[a-zA-Z\s]/, 'Tên tác giả chỉ được chứa chữ cái và khoảng cách'],
  },
  views: {
    type: Number,
    default: 0,
    min: [0, 'Lượt xem không được âm'],
  },
  like: {
    type: Number,
    default: 0,
    min: [0, 'Lượt thích không được âm'],
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
})

// Virtual field để trả về URL ảnh đầy đủ cho frontend
newsSchema.virtual('imageUrl').get(function () {
  if (!this.image) return ''
  // Nếu đã là URL tuyệt đối thì trả về luôn
  if (this.image.startsWith('http')) return this.image
  // Nếu là đường dẫn tương đối, trả về dạng /uploads/news/abc.jpg
  return `/uploads/${this.image.replace(/^uploads[\\/]/, '')}`
})

newsSchema.set('toJSON', { virtuals: true })
newsSchema.set('toObject', { virtuals: true })

module.exports = mongoose.model('News', newsSchema)
