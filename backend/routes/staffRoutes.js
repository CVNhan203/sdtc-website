const express = require("express");
const router = express.Router();
const { 
  loginStaff,
  getStaffProfile,
  updateStaffProfile 
} = require("../controllers/staffController");
const { protect, checkNewsOwnership } = require("../middleware/staffMiddleware");
const { 
  createNews, 
  getNewsByStaff, 
  getNewsById, 
  updateNews, 
  deleteNews 
} = require("../controllers/newsController");

// Routes cho tài khoản staff
router.post("/login", loginStaff);
router.get("/profile", protect, getStaffProfile);
router.put("/profile", protect, updateStaffProfile);

// Routes cho staff quản lý bài viết
router.post("/news", protect, createNews);
router.get("/news", protect, getNewsByStaff);
router.get("/news/:id", protect, getNewsById);
router.put("/news/:id", protect, checkNewsOwnership, updateNews);
router.delete("/news/:id", protect, checkNewsOwnership, deleteNews);

module.exports = router; 