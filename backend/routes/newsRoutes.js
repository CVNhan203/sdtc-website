const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadImage");
const {
  getNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  deleteNewsMany,
} = require("../controllers/newsController");

const adminOrStaffMiddleware = require("../middleware/adminOrStaffMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

// Route upload ảnh
router.post("/upload", upload.single("image"), (req, res) => {
  // Trả về đường dẫn file ảnh vừa upload
  res.json({ imagePath: req.file.path });
});

// Lấy danh sách bài viết (công khai)
router.get("/", getNews);

// Lấy chi tiết bài viết (công khai)
router.get("/:id", getNewsById);

// Tạo bài viết mới (yêu cầu admin hoặc staff)
router.post("/", authMiddleware, adminOrStaffMiddleware, createNews);

// Cập nhật bài viết (yêu cầu admin hoặc staff)
router.put("/:id", authMiddleware, adminOrStaffMiddleware, updateNews);

//Xóa nhiều bài viết (yêu cầu admin hoặc staff)
router.delete("/many", authMiddleware, adminOrStaffMiddleware, deleteNewsMany);

// Xóa bài viết (yêu cầu admin hoặc staff)
router.delete("/:id", authMiddleware, adminOrStaffMiddleware, deleteNews);

module.exports = router;
