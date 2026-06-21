const express = require("express");

const {
  createSprint,
  getSprintById,
  getProjectSprints,
  startSprint,
  completeSprint,
  updateSprint,
  deleteSprint
} = require("../controllers/sprint.controller");

const authMiddleware = require("../middlewares/auth.middleware");

const allowRoles = require("../middlewares/role.middleware");

const { ROLES } = require("../utils/constants");

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  allowRoles(ROLES.ORG_ADMIN, ROLES.PRODUCT_MANAGER),
  createSprint,
);

router.get("/:sprintId", authMiddleware, getSprintById);

router.get("/project/:projectId", authMiddleware, getProjectSprints);

router.patch(
  "/:sprintId/start",
  authMiddleware,
  allowRoles(ROLES.ORG_ADMIN, ROLES.PRODUCT_MANAGER),
  startSprint,
);

router.patch(
  "/:sprintId/complete",
  authMiddleware,
  allowRoles(ROLES.ORG_ADMIN, ROLES.PRODUCT_MANAGER),
  completeSprint,
);

router.patch(
  "/:sprintId",
  authMiddleware,
  allowRoles(ROLES.ORG_ADMIN, ROLES.PRODUCT_MANAGER),
  updateSprint,
);

router.delete(
  "/:sprintId",
  authMiddleware,
  allowRoles(ROLES.ORG_ADMIN, ROLES.PRODUCT_MANAGER),
  deleteSprint,
);

module.exports = router;
