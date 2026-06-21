const express = require("express");

const {
  createComment,
  getTaskComments,
  updateComment,
  deleteComment,
} = require("../controllers/comment.controller");

const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/create", authMiddleware, createComment);

router.get("/task/:taskId", authMiddleware, getTaskComments);

router.patch("/:commentId", authMiddleware, updateComment);

router.delete("/:commentId", authMiddleware, deleteComment);

module.exports = router;
