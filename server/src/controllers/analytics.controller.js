const Project = require("../models/Project");
const Team = require("../models/Team");
const Sprint = require("../models/Sprint");
const Task = require("../models/Task");

// To get project analytics
const getProjectAnalytics = async (req, res) => {
  try {
    const project =
      await Project.findById(
        req.params.projectId
      );

    if (!project) {
      return res.status(404).json({
        success: false,
        message:
          "Project not found",
      });
    }

    const tasks =
      await Task.find({
        project: project._id,
      });

    const analytics = {
      totalTasks: tasks.length,

      todoTasks: tasks.filter(
        task =>
          task.status === "TODO"
      ).length,

      inProgressTasks:
        tasks.filter(
          task =>
            task.status ===
            "IN_PROGRESS"
        ).length,

      reviewTasks: tasks.filter(
        task =>
          task.status ===
          "IN_REVIEW"
      ).length,

      completedTasks:
        tasks.filter(
          task =>
            task.status === "DONE"
        ).length,

      blockedTasks:
        tasks.filter(
          task =>
            task.status ===
            "BLOCKED"
        ).length,
    };

    analytics.completionRate =
      analytics.totalTasks === 0
        ? 0
        : Number(
            (
              (analytics.completedTasks /
                analytics.totalTasks) *
              100
            ).toFixed(2)
          );

    return res.status(200).json({
      success: true,
      project: project.title,
      analytics,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

// To get sprint analytics
const getSprintAnalytics = async (req, res) => {
    try {
      const sprint =
        await Sprint.findById(
          req.params.sprintId
        );

      if (!sprint) {
        return res.status(404).json({
          success: false,
          message:
            "Sprint not found",
        });
      }

      const tasks =
        await Task.find({
          sprint: sprint._id,
        });

      const completed =
        tasks.filter(
          task =>
            task.status === "DONE"
        ).length;

      const velocity =
        completed;

      return res.status(200).json({
        success: true,

        sprint:
          sprint.sprintName,

        analytics: {
          totalTasks:
            tasks.length,

          completedTasks:
            completed,

          sprintVelocity:
            velocity,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };


// To get team analytics
const getTeamAnalytics = async (req, res) => {
    try {
      const team =
        await Team.findById(
          req.params.teamId
        ).populate(
          "members"
        );

      if (!team) {
        return res.status(404).json({
          success: false,
          message:
            "Team not found",
        });
      }

      const result = [];

      for (const member of team.members) {
        const tasks =
          await Task.find({
            assignedTo:
              member._id,
          });

        result.push({
          userId: member._id,
          name: member.name,

          completedTasks:
            tasks.filter(
              task =>
                task.status ===
                "DONE"
            ).length,

          activeTasks:
            tasks.filter(
              task =>
                task.status ===
                  "TODO" ||
                task.status ===
                  "IN_PROGRESS"
            ).length,
        });
      }

      return res.status(200).json({
        success: true,
        team: team.name,
        members: result,
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
  getProjectAnalytics,
  getSprintAnalytics,
  getTeamAnalytics,
};