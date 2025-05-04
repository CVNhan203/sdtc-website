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

const adminMiddleware = require("../middleware/adminMiddleware");
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

// Tạo bài viết mới (yêu cầu admin)
router.post("/", protect, checkActiveStatus, createNews);

// Cập nhật bài viết (yêu cầu admin)
router.put("/:id", protect, checkActiveStatus, updateNews);

//Xóa nhiều bài viết (yêu cầu admin)
router.delete("/many", authMiddleware, adminMiddleware, deleteNewsMany);

// Xóa bài viết (yêu cầu admin)
router.delete("/:id", protect, checkActiveStatus, deleteNews);

module.exports = router;
