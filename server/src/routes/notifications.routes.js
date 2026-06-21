const express = require("express");

const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require("../controllers/notifications.controller");

const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, getNotifications);

router.get("/unread-count", authMiddleware, getUnreadCount);

router.patch("/:notificationId/read", authMiddleware, markAsRead);

router.patch("/read-all", authMiddleware, markAllAsRead);

router.delete("/:notificationId", authMiddleware, deleteNotification);

module.exports = router;
