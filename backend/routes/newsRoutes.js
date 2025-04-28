const express = require("express");
const router = express.Router();
const {
  getNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
} = require("../controllers/newsController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Lấy danh sách bài viết (công khai)
router.get("/", getNews);

// Lấy chi tiết bài viết (công khai)
router.get("/:id", getNewsById);

// Tạo bài viết mới (yêu cầu admin)
router.post("/", authMiddleware, adminMiddleware, createNews);

// Cập nhật bài viết (yêu cầu admin)
router.put("/:id", authMiddleware, adminMiddleware, updateNews);

// Xóa bài viết (yêu cầu admin)
router.delete("/:id", authMiddleware, adminMiddleware, deleteNews);

module.exports = router;
