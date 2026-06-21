const express = require("express");

const {
  createProject,
  getProjectById,
  getOrganizationProjects,
  updateProject,
  deleteProject,
} = require("../controllers/project.controller");

const authMiddleware = require("../middlewares/auth.middleware");

const allowRoles = require("../middlewares/role.middleware");

const { ROLES } = require("../utils/constants");

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  allowRoles(ROLES.ORG_ADMIN, ROLES.PRODUCT_MANAGER),
  createProject,
);

router.get("/:projectId", authMiddleware, getProjectById);

router.get(
  "/organization/:organizationId",
  authMiddleware,
  getOrganizationProjects,
);

router.patch(
  "/:projectId",
  authMiddleware,
  allowRoles(ROLES.ORG_ADMIN, ROLES.PRODUCT_MANAGER),
  updateProject,
);

router.delete(
  "/:projectId",
  authMiddleware,
  allowRoles(ROLES.ORG_ADMIN),
  deleteProject,
);

module.exports = router;
