const Organization = require("../models/Organization");
const Project = require("../models/Project");
const Team = require("../models/Team");
const Task = require("../models/Task");
const Sprint = require("../models/Sprint");
const Notification = require("../models/Notification");
const Activity = require("../models/Activity");

// To get dashboard overview
const getDashboardOverview = async (req, res) => {
  try {
    const organizationCount = await Organization.countDocuments();

    const projectCount = await Project.countDocuments();

    const teamCount = await Team.countDocuments();

    const taskCount = await Task.countDocuments();

    const completedTasks = await Task.countDocuments({
      status: "DONE",
    });

    const blockedTasks = await Task.countDocuments({
      status: "BLOCKED",
    });

    const pendingTasks = taskCount - completedTasks;

    const activeSprints = await Sprint.countDocuments({
      status: "ACTIVE",
    });

    const unreadNotifications = await Notification.countDocuments({
      recipient: req.user._id,
      isRead: false,
    });

    const recentActivities = await Activity.find()
      .sort({
        createdAt: -1,
      })
      .limit(10)
      .populate("user", "name");

    return res.status(200).json({
      success: true,

      organizationCount,

      projectCount,

      teamCount,

      taskCount,

      completedTasks,

      pendingTasks,

      blockedTasks,

      activeSprints,

      unreadNotifications,

      recentActivities,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardOverview,
};
