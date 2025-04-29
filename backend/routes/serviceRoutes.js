const express = require("express");
const router = express.Router();
const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require("../controllers/serviceController");
const { protect } = require("../middleware/authMiddleware");
const { checkActiveStatus } = require("../middleware/adminMiddleware");

// Routes công khai
router.get("/", getServices);
router.get("/:id", getServiceById);

// Routes yêu cầu quyền admin
router.post("/", protect, checkActiveStatus, createService);
router.put("/:id", protect, checkActiveStatus, updateService);
router.delete("/:id", protect, checkActiveStatus, deleteService);

module.exports = router;
