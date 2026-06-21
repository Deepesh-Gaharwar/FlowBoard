const express = require("express");

const {
  getProjectActivities,
  getTaskActivities,
} = require("../controllers/activity.controller");

const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// To get all activities of a project
router.get("/project/:projectId", authMiddleware, getProjectActivities);

// To get all activities of a task
router.get("/task/:taskId", authMiddleware, getTaskActivities);

module.exports = router;
