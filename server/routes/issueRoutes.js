
const express = require("express");

const {
  createIssue,
  getMyIssues,
  getAllIssues,
  updateIssueStatus,
} = require("../controllers/issueController");

const {
  authMiddleware,
  adminOnly,
} = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Resident routes
router.post("/", authMiddleware, upload.single("photo"), createIssue);
router.get("/my", authMiddleware, getMyIssues);

// Admin routes
router.get("/", authMiddleware, adminOnly, getAllIssues);
router.patch("/:id/status", authMiddleware, adminOnly, updateIssueStatus);

module.exports = router;
