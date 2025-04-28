const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Tiêu đề bài viết là bắt buộc"],
    trim: true,
    minLength: [10, "Tiêu đề phải có ít nhất 10 ký tự"],
    maxLength: [200, "Tiêu đề không được vượt quá 200 ký tự"],
  },
  summary: {
    type: String,
    required: [true, "Tóm tắt bài viết là bắt buộc"],
    trim: true,
    minLength: [20, "Tóm tắt phải có ít nhất 20 ký tự"],
    maxLength: [500, "Tóm tắt không được vượt quá 500 ký tự"],
  },
  content: {
    type: String,
    required: [true, "Nội dung bài viết là bắt buộc"],
    trim: true,
    minLength: [100, "Nội dung phải có ít nhất 100 ký tự"],
  },
  image: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    required: [true, "Loại bài viết là bắt buộc"],
  },
  publishedDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  author: {
    type: String,
    default: "Admin",
    trim: true,
  },
  views: {
    type: Number,
    default: 0,
    min: [0, "Lượt xem không được âm"],
  },
  like: {
    type: Number,
    default: 0,
    min: [0, "Lượt thích không được âm"],
  },
});
module.exports = mongoose.model("News", newsSchema);
