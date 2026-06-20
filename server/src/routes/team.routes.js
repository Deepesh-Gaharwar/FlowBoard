const express = require("express");

const {
  createTeam,
  getTeamById,
  getOrganizationTeams,
  assignTeamLead,
  addMemberToTeam,
  removeMemberFromTeam,
} = require("../controllers/team.controller");

const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/create", authMiddleware, createTeam);

router.get("/:teamId", authMiddleware, getTeamById);

router.get(
  "/organization/:organizationId",
  authMiddleware,
  getOrganizationTeams,
);

router.patch("/:teamId/assign-team-lead", authMiddleware, assignTeamLead);

router.patch("/:teamId/add-member", authMiddleware, addMemberToTeam);

router.patch("/:teamId/remove-member", authMiddleware, removeMemberFromTeam);

module.exports = router;
