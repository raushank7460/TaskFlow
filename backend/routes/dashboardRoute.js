const express = require("express");
const router = express.Router();
const {
  getDashboard,
  getTaskStats,
  getTodayTasks,
  getOverdueTasks,
} = require("../controllers/dashboardController");
const { protect } = require("../middleware/authMiddleware");

// Saare dashboard routes protected hain
router.get("/", protect, getDashboard);
router.get("/stats", protect, getTaskStats);
router.get("/today", protect, getTodayTasks);
router.get("/overdue", protect, getOverdueTasks);

module.exports = router;
