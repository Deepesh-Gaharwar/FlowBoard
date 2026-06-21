const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      default: null,
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },

    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      default: null,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    action: {
    type: String,
    enum: [
      "ORG_CREATED",
      "MEMBER_ADDED",
      "MEMBER_REMOVED",

      "TEAM_CREATED",
      "TEAM_LEAD_ASSIGNED",
      "MEMBER_ADDED_TO_TEAM",
      "MEMBER_REMOVED_FROM_TEAM",

      "PROJECT_CREATED",
      "PROJECT_UPDATED",
      "PRODUCT_MANAGER_ADDED",
      "TEAM_ADDED_TO_PROJECT",
      "MEMBER_ADDED_TO_PROJECT",
      "VIEWER_ADDED_TO_PROJECT",

      "SPRINT_CREATED",
      "SPRINT_STARTED",
      "SPRINT_COMPLETED",

      "TASK_CREATED",
      "TASK_ASSIGNED",
      "TASK_UPDATED",
      "TASK_STARTED",
      "TASK_REVIEWED",
      "TASK_COMPLETED",
      "TASK_BLOCKED",

      "COMMENT_ADDED",
      "COMMENT_UPDATED",
      "COMMENT_DELETED",
    ],
  },

    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Activity", activitySchema);
