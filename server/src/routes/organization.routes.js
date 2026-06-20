const express = require("express");

const {
  createOrganization,
  getOrganizationById,
  getMyOrganization,
} = require("../controllers/organization.controller");

const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/create", authMiddleware, createOrganization);

router.get("/my-organization", authMiddleware, getMyOrganization);

router.get("/:organizationId", authMiddleware, getOrganizationById);

module.exports = router;
