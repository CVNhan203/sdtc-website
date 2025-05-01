const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadImage");

// Route upload ảnh riêng
router.post("/upload", upload.single("image"), (req, res) => {
  //Trả về đường dẫn của ảnh
  res.json({ imagePath: req.file.path });
});

const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require("../controllers/serviceController");
const adminMiddleware = require("../middleware/adminMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

// Routes công khai
router.get("/", getServices);
router.get("/:id", getServiceById);

// Routes yêu cầu quyền admin
router.post(
  "/",
  authMiddleware,
  authMiddleware,
  adminMiddleware,
  createService
);
router.put("/:id", adminMiddleware, adminMiddleware, updateService);
router.delete("/:id", authMiddleware, adminMiddleware, deleteService);

module.exports = router;