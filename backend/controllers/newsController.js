const asyncHandler = require("express-async-handler");
const News = require("../models/newsModel");


// Lấy danh sách bài viết

exports.getNews = asyncHandler(async (req, res) => {
  const {
    type,
    page = 1,
    limit = 9,
    sortBy = "publishedDate",
    order = "desc",
  } = req.query;
  const query = type ? { type } : {};
  query.isDeleted = false;
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

// Lấy chi tiết bài viết

exports.getNewsById = asyncHandler(async (req, res) => {
  const news = await News.findById(req.params.id);

  if (news) {
    res.json(news);
  } else {
    res.status(404);
    throw new Error("Không tìm thấy bài viết");
  }
});


// Tạo bài viết mới

exports.createNews = asyncHandler(async (req, res) => {
  const { title, summary, content, type, image } = req.body;

  if (!title || !summary || !content || !type) {
    res.status(400);
    throw new Error("Vui lòng điền đầy đủ thông tin bài viết");
  }

  const news = new News({
    title,
    summary,
    content,
    type,
    image: image || "",
    author: req.staff._id,
    authorName: req.staff.fullName
  });

  const createdNews = await news.save();
  res.status(201).json(createdNews);
});

// @desc    Lấy danh sách bài viết của staff đăng nhập
// @route   GET /api/staff/news
// @access  Private (Staff)
exports.getNewsByStaff = asyncHandler(async (req, res) => {
  const news = await News.find({ author: req.staff._id, isDeleted: false });
  res.json(news);
});

// @desc    Lấy chi tiết bài viết theo ID (staff)
// @route   GET /api/staff/news/:id
// @access  Private (Staff)
exports.getNewsByIdByStaff = asyncHandler(async (req, res) => {
  const news = await News.findById(req.params.id);

  if (news) {
    res.json(news);
  } else {
    res.status(404);
    throw new Error("Không tìm thấy bài viết");
  }
});

// @desc    Cập nhật bài viết (chỉ tác giả mới có quyền)
// @route   PUT /api/staff/news/:id
// @access  Private (Staff + Ownership)
exports.updateNews = asyncHandler(async (req, res) => {
  const { title, summary, content, type, image } = req.body;

  const news = await News.findById(req.params.id);

  if (news) {
    news.title = title || news.title;
    news.summary = summary || news.summary;
    news.content = content || news.content;
    news.type = type || news.type;
    news.image = image || news.image;

    const updatedNews = await news.save();
    res.json(updatedNews);
  } else {
    res.status(404);
    throw new Error("Không tìm thấy bài viết");
  }
});

// @desc    Xóa bài viết (chỉ tác giả mới có quyền)
// @route   DELETE /api/staff/news/:id
// @access  Private (Staff + Ownership)
exports.deleteNews = asyncHandler(async (req, res) => {
  const news = await News.findById(req.params.id);

  if (news) {
    news.isDeleted = true;
    await news.save();
    res.json({ message: "Bài viết đã được xóa" });
  } else {
    res.status(404);
    throw new Error("Không tìm thấy bài viết");
  }
});

// Xóa nhiều bài viết (đánh dấu là đã xóa)

exports.deleteNewsMany = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    res.status(400);
    throw new Error("Vui lòng cung cấp danh sách ID bài viết để xóa");
  }

  const result = await News.updateMany(
    { _id: { $in: ids } },
    { $set: { isDeleted: true } }
  );

  if (result.modifiedCount === 0) {
    res.status(404);
    throw new Error("Không tìm thấy bài viết nào để xóa");
  }

  res.status(200).json({
    success: true,
    message: `Đã ẩn ${result.modifiedCount} bài viết thành công`,
  });

});

module.exports = {
  getNews: exports.getNews,
  getNewsById: exports.getNewsById,
  createNews: exports.createNews,
  updateNews: exports.updateNews,
  deleteNews: exports.deleteNews,
  deleteNewsMany: exports.deleteNewsMany,
  getNewsByStaff: exports.getNewsByStaff
};



