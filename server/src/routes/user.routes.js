const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");

const { updateUserRole } = require("../controllers/user.controller");

router.patch("/:userId/role", authMiddleware, updateUserRole);

module.exports = router;
