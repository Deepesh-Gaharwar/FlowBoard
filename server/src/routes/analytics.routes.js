const express = require("express");

const {
  getProjectAnalytics,
  getSprintAnalytics,
  getTeamAnalytics,
} = require("../controllers/analytics.controller");

const authMiddleware = require("../middlewares/auth.middleware");

const allowRoles = require("../middlewares/role.middleware");

const { ROLES } = require("../utils/constants");

const router = express.Router();

router.get("/project/:projectId", authMiddleware, getProjectAnalytics);

router.get("/team/:teamId", authMiddleware, getTeamAnalytics);

router.get("/sprint/:sprintId", authMiddleware, getSprintAnalytics);

module.exports = router;
