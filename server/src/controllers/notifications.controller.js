const Notification = require("../models/Notification");

// To get all notifications of logged in user
const getNotifications = async (req, res) => {
  try {
    const notifications =
      await Notification.find({
        recipient: req.user._id,
      })
        .populate(
          "sender",
          "name email"
        )
        .populate(
          "task",
          "taskKey title"
        )
        .populate(
          "project",
          "title projectKey"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count:
        notifications.length,
      notifications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};


// To get unread notifications count
const getUnreadCount = async (req, res) => {
    try {
      const count =
        await Notification.countDocuments(
          {
            recipient:
              req.user._id,
            isRead: false,
          }
        );

      return res.status(200).json({
        success: true,
        unreadCount: count,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

// To mark notification as read
const markAsRead = async (req, res) => {
  try {
    const notification =
      await Notification.findByIdAndUpdate(
        req.params.notificationId,
        {
          isRead: true,
        },
        {
          returnDocument:
            "after",
        }
      );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message:
          "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Notification marked as read",
      notification,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};


// To mark all notifications as read
const markAllAsRead = async (req, res) => {
    try {
      await Notification.updateMany(
        {
          recipient:
            req.user._id,
          isRead: false,
        },
        {
          isRead: true,
        }
      );

      return res.status(200).json({
        success: true,
        message:
          "All notifications marked as read",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };


// To delete notification
const deleteNotification = async (req, res) => {
    try {
      const notification =
        await Notification.findById(
          req.params.notificationId
        );

      if (!notification) {
        return res.status(404).json({
          success: false,
          message:
            "Notification not found",
        });
      }

      await Notification.findByIdAndDelete(
        notification._id
      );

      return res.status(200).json({
        success: true,
        message:
          "Notification deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };


module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
