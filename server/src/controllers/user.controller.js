const User = require("../models/User");
const createActivity = require("../utils/createActivity");
const createNotification = require("../utils/createNotification");
const createAuditLog = require("../utils/createAuditLog");

// To update role of a user
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    const validRoles = ["PRODUCT_MANAGER", "TEAM_LEAD", "MEMBER", "VIEWER"];

    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const targetUser = await User.findById(req.params.userId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const oldRole = targetUser.role;

    // ORG ADMIN

    if (req.user.role === "ORG_ADMIN") {
      targetUser.role = role;
    }

    // PRODUCT MANAGER
    else if (req.user.role === "PRODUCT_MANAGER") {
      // Cannot modify Org Admin
      // Cannot modify another Product Manager

      if (
        targetUser.role === "ORG_ADMIN" ||
        targetUser.role === "PRODUCT_MANAGER"
      ) {
        return res.status(403).json({
          success: false,
          message: "Cannot modify Org Admin or Product Manager",
        });
      }

      const allowedRoles = ["TEAM_LEAD", "MEMBER", "VIEWER"];

      if (!allowedRoles.includes(role)) {
        return res.status(403).json({
          success: false,
          message:
            "Product Manager can only assign Team Lead, Member or Viewer",
        });
      }

      targetUser.role = role;
    }

    // TEAM LEAD
    else if (req.user.role === "TEAM_LEAD") {
      // Cannot modify higher roles

      if (
        targetUser.role === "ORG_ADMIN" ||
        targetUser.role === "PRODUCT_MANAGER" ||
        targetUser.role === "TEAM_LEAD"
      ) {
        return res.status(403).json({
          success: false,
          message: "Cannot modify higher level roles",
        });
      }

      const allowedRoles = ["MEMBER", "VIEWER"];

      if (!allowedRoles.includes(role)) {
        return res.status(403).json({
          success: false,
          message: "Team Lead can only assign Member or Viewer",
        });
      }

      targetUser.role = role;
    }

    // MEMBER / VIEWER
    else {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    await targetUser.save();

    // Audit Log
    await createAuditLog({
      organization: targetUser.organization,

      entityType: "USER",

      entityId: targetUser._id,

      action: "ROLE_UPDATED",

      performedBy: req.user._id,

      details: `${req.user.name} changed ${targetUser.name}'s role from ${oldRole} to ${role}`,
    });

    // Activity Log
    await createActivity({
      organization: targetUser.organization,

      user: req.user._id,

      action: "ROLE_UPDATED",

      message: `${req.user.name} changed ${targetUser.name}'s role from ${oldRole} to ${role}`,
    });

    // Notification
    await createNotification({
      recipient: targetUser._id,

      sender: req.user._id,

      title: "Role Updated",

      message: `Your role has been changed from ${oldRole} to ${role}`,

      type: "ROLE_UPDATED",
    });

    return res.status(200).json({
      success: true,
      message: "Role updated successfully",
      user: targetUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  updateUserRole,
};
