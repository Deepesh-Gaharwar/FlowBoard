const express = require("express");

const {
  createTask,
  getTaskById,
  getProjectTasks,
  getSprintTasks,
  assignTask,
  updateTask,
  startTask,
  reviewTask,
  completeTask,
  blockTask,
} = require("../controllers/task.controller");

const authMiddleware = require("../middlewares/auth.middleware");

const allowRoles = require("../middlewares/role.middleware");

const { ROLES } = require("../utils/constants");

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  allowRoles(ROLES.ORG_ADMIN, ROLES.PRODUCT_MANAGER, ROLES.TEAM_LEAD),
  createTask,
);

router.get("/project/:projectId", authMiddleware, getProjectTasks);

router.get("/sprint/:sprintId", authMiddleware, getSprintTasks);

router.get("/:taskId", authMiddleware, getTaskById);

router.patch("/:taskId", authMiddleware, updateTask);

router.delete("/:taskId",authMiddleware,allowRoles(ROLES.ORG_ADMIN, ROLES.PRODUCT_MANAGER, ROLES.TEAM_LEAD),deleteTask);

router.patch("/:taskId/assign", authMiddleware, assignTask);

router.patch("/:taskId/start", authMiddleware, startTask);

router.patch("/:taskId/review", authMiddleware, reviewTask);

router.patch("/:taskId/complete", authMiddleware, completeTask);

router.patch("/:taskId/block", authMiddleware, blockTask);

module.exports = router;
