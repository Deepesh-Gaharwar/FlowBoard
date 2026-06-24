const express = require("express");

const {
  createOrganization,
  getOrganizationById,
  getMyOrganizations,
  getOrganizationMembers,
} = require("../controllers/organization.controller");

const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/create", authMiddleware, createOrganization);

router.get("/my-organizations", authMiddleware, getMyOrganizations);

router.get("/:organizationId", authMiddleware, getOrganizationById);

router.get("/:organizationId/members", authMiddleware, getOrganizationMembers);

module.exports = router;
