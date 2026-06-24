const express = require("express");

const {
  createProject,
  getProjectById,
  getOrganizationProjects,
  getMyProjects,
  updateProject,
  deleteProject,
  addProductManager,
  removeProductManager,
  addTeam,
  removeTeam,
  addMember,
  removeMember,
  addViewer,
  removeViewer,
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

router.get("/my/projects", authMiddleware, getMyProjects);

router.get("/:projectId", authMiddleware, getProjectById);

router.get("/my/projects", authMiddleware, getMyProjects);

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

router.patch(
  "/:projectId/add-product-manager",
  authMiddleware,
  allowRoles(ROLES.ORG_ADMIN, ROLES.PRODUCT_MANAGER),
  addProductManager,
);

router.patch(
  "/:projectId/remove-product-manager",
  authMiddleware,
  allowRoles(ROLES.ORG_ADMIN, ROLES.PRODUCT_MANAGER),
  removeProductManager,
);

router.patch(
  "/:projectId/add-team",
  authMiddleware,
  allowRoles(ROLES.ORG_ADMIN, ROLES.PRODUCT_MANAGER),
  addTeam,
);

router.patch(
  "/:projectId/remove-team",
  authMiddleware,
  allowRoles(ROLES.ORG_ADMIN, ROLES.PRODUCT_MANAGER),
  removeTeam,
);

router.patch(
  "/:projectId/add-member",
  authMiddleware,
  allowRoles(ROLES.ORG_ADMIN, ROLES.PRODUCT_MANAGER),
  addMember,
);

router.patch(
  "/:projectId/remove-member",
  authMiddleware,
  allowRoles(ROLES.ORG_ADMIN, ROLES.PRODUCT_MANAGER),
  removeMember,
);

router.patch(
  "/:projectId/add-viewer",
  authMiddleware,
  allowRoles(ROLES.ORG_ADMIN, ROLES.PRODUCT_MANAGER),
  addViewer,
);

router.patch(
  "/:projectId/remove-viewer",
  authMiddleware,
  allowRoles(ROLES.ORG_ADMIN, ROLES.PRODUCT_MANAGER),
  removeViewer,
);

module.exports = router;
