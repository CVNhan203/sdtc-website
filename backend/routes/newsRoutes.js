const express = require("express");
const router = express.Router();
const {
  getNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
} = require("../controllers/newsController");
const { protect } = require("../middleware/authMiddleware");
const { checkActiveStatus } = require("../middleware/adminMiddleware");

// Lấy danh sách bài viết (công khai)
router.get("/", getNews);

// Lấy chi tiết bài viết (công khai)
router.get("/:id", getNewsById);

// Tạo bài viết mới (yêu cầu admin)
router.post("/", protect, checkActiveStatus, createNews);

// Cập nhật bài viết (yêu cầu admin)
router.put("/:id", protect, checkActiveStatus, updateNews);

// Xóa bài viết (yêu cầu admin)
router.delete("/:id", protect, checkActiveStatus, deleteNews);

module.exports = router;
