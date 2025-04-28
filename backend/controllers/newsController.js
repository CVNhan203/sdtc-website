const asyncHandler = require("express-async-handler");
const News = require("../models/newsModel");

// @desc    Lấy tất cả bài viết với phân trang và lọc
// @route   GET /api/news
// @access  Public
exports.getNews = asyncHandler(async (req, res) => {
  const {
    type,
    page = 1,
    limit = 9,
    sortBy = "publishedDate",
    order = "desc",
  } = req.query;
  const query = type ? { type } : {};
  const skip = (Number(page) - 1) * Number(limit);

  // Kiểm tra trường sắp xếp hợp lệ
  const validSortFields = ["publishedDate", "views", "like", "title"];
  const sortField = validSortFields.includes(sortBy) ? sortBy : "publishedDate";

  const sortQuery = {};
  sortQuery[sortField] = order === "desc" ? -1 : 1;

  const [news, total] = await Promise.all([
    News.find(query).sort(sortQuery).skip(skip).limit(Number(limit)).lean(),
    News.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / Number(limit));

  res.status(200).json({
    success: true,
    data: news,
    pagination: {
      total,
      totalPages,
      currentPage: Number(page),
      limit: Number(limit),
    },
    message: "Lấy danh sách bài viết thành công",
  });
});

// @desc    Lấy một bài viết theo ID và tăng lượt xem
// @route   GET /api/news/:id
// @access  Public
exports.getNewsById = asyncHandler(async (req, res) => {
  const news = await News.findByIdAndUpdate(
    req.params.id,
    { $inc: { views: 1 } },
    { new: true }
  ).lean();

  if (!news) {
    res.status(404);
    throw new Error("Không tìm thấy bài viết");
  }

  res.status(200).json({
    success: true,
    data: news,
    message: "Lấy chi tiết bài viết thành công",
  });
});

// @desc    Tạo bài viết mới
// @route   POST /api/news
// @access  Private/Admin
exports.createNews = asyncHandler(async (req, res) => {
  const { title, summary, content, image, type, author } = req.body;

  // Kiểm tra các trường bắt buộc (đơn giản)
  if (!title || !summary || !content || !type) {
    res.status(400);
    throw new Error("Vui lòng điền đầy đủ thông tin bắt buộc");
  }

  // Mongoose sẽ xử lý validation chi tiết (độ dài, định dạng...)
  try {
    const news = await News.create({
      title,
      summary,
      content,
      image,
      type,
      publishedDate: new Date(),
      views: 0,
      like: 0,
      author: author || "Admin",
    });

    res.status(201).json({
      success: true,
      data: news,
      message: "Tạo bài viết thành công",
    });
  } catch (error) {
    // Xử lý lỗi validation từ Mongoose
    if (error.name === "ValidationError") {
      res.status(400);
      const messages = Object.values(error.errors).map((err) => err.message);
      throw new Error(messages.join(", "));
    }
    throw error;
  }
});

// @desc    Cập nhật bài viết
// @route   PATCH /api/news/:id
// @access  Private/Admin
exports.updateNews = asyncHandler(async (req, res) => {
  const updateData = req.body;
  const newsId = req.params.id;

  if (Object.keys(updateData).length === 0) {
    res.status(400);
    throw new Error("Không có dữ liệu để cập nhật");
  }

  try {
    const news = await News.findByIdAndUpdate(
      newsId,
      { $set: updateData },
      { new: true, runValidators: true } // runValidators: true sẽ kích hoạt validation
    ).lean();

    if (!news) {
      res.status(404);
      throw new Error("Không tìm thấy bài viết");
    }

    res.status(200).json({
      success: true,
      data: news,
      message: "Cập nhật bài viết thành công",
    });
  } catch (error) {
    // Xử lý lỗi validation từ Mongoose
    if (error.name === "ValidationError") {
      res.status(400);
      const messages = Object.values(error.errors).map((err) => err.message);
      throw new Error(messages.join(", "));
    }
    throw error;
  }
});

// @desc    Xóa bài viết
// @route   DELETE /api/news/:id
// @access  Private/Admin
exports.deleteNews = asyncHandler(async (req, res) => {
  const news = await News.findByIdAndDelete(req.params.id);

  if (!news) {
    res.status(404);
    throw new Error("Không tìm thấy bài viết");
  }

  res.status(200).json({
    success: true,
    message: "Xóa bài viết thành công",
  });
});
