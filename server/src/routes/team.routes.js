const express = require("express");

const {
  createTeam,
  getTeamById,
  getOrganizationTeams,
  assignProductManager,
  assignTeamLead,
  addMemberToTeam,
  removeMemberFromTeam,
} = require("../controllers/team.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const allowRoles = require("../middlewares/role.middleware");
const { ROLES } = require("../utils/constants");

const router = express.Router();

router.post("/create", authMiddleware, allowRoles(ROLES.ORG_ADMIN), createTeam);

router.get("/:teamId", authMiddleware, getTeamById);

router.get(
  "/organization/:organizationId",
  authMiddleware,
  getOrganizationTeams,
);

router.patch(
  "/:teamId/assign-pm",
  authMiddleware,
  allowRoles(ROLES.ORG_ADMIN),
  assignProductManager,
);

router.patch(
  "/:teamId/assign-team-lead",
  authMiddleware,
  allowRoles(ROLES.ORG_ADMIN),
  assignTeamLead,
);

router.patch(
  "/:teamId/add-member",
  authMiddleware,
  allowRoles(ROLES.ORG_ADMIN, ROLES.TEAM_LEAD),
  addMemberToTeam,
);

router.patch("/:teamId/remove-member", authMiddleware, removeMemberFromTeam);

module.exports = router;
