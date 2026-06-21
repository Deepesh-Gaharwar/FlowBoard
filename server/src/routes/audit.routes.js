const express = require("express");

const {
  getProjectAuditLogs,
  getOrganizationAuditLogs,
} = require("../controllers/audit.controller");

const authMiddleware = require("../middlewares/auth.middleware");

const allowRoles = require("../middlewares/role.middleware");

const { ROLES } = require("../utils/constants");

const router = express.Router();

router.get(
  "/project/:projectId",
  authMiddleware,
  allowRoles(ROLES.ORG_ADMIN, ROLES.PRODUCT_MANAGER),
  getProjectAuditLogs,
);

router.get(
  "/organization/:organizationId",
  authMiddleware,
  allowRoles(ROLES.ORG_ADMIN),
  getOrganizationAuditLogs,
);

module.exports = router;
