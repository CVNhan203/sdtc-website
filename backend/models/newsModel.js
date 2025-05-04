const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Tiêu đề bài viết là bắt buộc"],
    trim: true,
    maxLength: [200, "Tiêu đề không được vượt quá 200 ký tự"],
  },
  summary: {
    type: String,
    required: [true, "Tóm tắt bài viết là bắt buộc"],
    maxLength: [500, "Tóm tắt không được vượt quá 500 ký tự"],
  },
  content: {
    type: String,
    required: [true, "Nội dung bài viết là bắt buộc"],
  },
  image: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    required: [true, "Loại bài viết là bắt buộc"],
    enum: {
      values: ["news", "blog", "event"],
      message: "Loại bài viết không hợp lệ",
    },
  },
  publishedDate: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: String,
    default: "Admin",
    trim: true,
    minlength: [3, "Tên tác giả phải có ít nhất 3 ký tự"],
    maxlength: [50, "Tên tác giả không được vượt quá 50 ký tự"],
    match: [/^[a-zA-Z\s]/, "Tên tác giả chỉ được chứa chữ cái và khoảng trắng"],
  },
  views: {
    type: Number,
    default: 0,
  },
  like: {
    type: Number,
    default: 0,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("News", newsSchema);
