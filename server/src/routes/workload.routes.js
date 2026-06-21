const express = require("express");

const {
  getMemberWorkload,
  getTeamWorkload,
  getProjectWorkload,
} = require("../controllers/workload.controller");

const authMiddleware = require("../middlewares/auth.middleware");

const allowRoles = require("../middlewares/role.middleware");

const { ROLES } = require("../utils/constants");

const router = express.Router();

router.get(
  "/member/:userId",
  authMiddleware,
  allowRoles(ROLES.ORG_ADMIN, ROLES.PRODUCT_MANAGER, ROLES.TEAM_LEAD),
  getMemberWorkload,
);

router.get(
  "/team/:teamId",
  authMiddleware,
  allowRoles(ROLES.ORG_ADMIN, ROLES.PRODUCT_MANAGER, ROLES.TEAM_LEAD),
  getTeamWorkload,
);

router.get(
  "/project/:projectId",
  authMiddleware,
  allowRoles(ROLES.ORG_ADMIN, ROLES.PRODUCT_MANAGER, ROLES.TEAM_LEAD),
  getProjectWorkload,
);

module.exports = router;
