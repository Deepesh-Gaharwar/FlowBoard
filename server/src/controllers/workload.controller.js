const Task = require("../models/Task");
const Team = require("../models/Team");
const User = require("../models/User");
const Project = require("../models/Project");


// To get workload of a member
const getMemberWorkload = async (req, res) => {
  try {
    const user =
      await User.findById(
        req.params.userId
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }

    const tasks =
      await Task.find({
        assignedTo: user._id,
      });

    const workload = {
      totalTasks: tasks.length,

      todo: tasks.filter(
        (task) =>
          task.status === "TODO"
      ).length,

      inProgress: tasks.filter(
        (task) =>
          task.status ===
          "IN_PROGRESS"
      ).length,

      review: tasks.filter(
        (task) =>
          task.status ===
          "IN_REVIEW"
      ).length,

      done: tasks.filter(
        (task) =>
          task.status === "DONE"
      ).length,

      blocked: tasks.filter(
        (task) =>
          task.status ===
          "BLOCKED"
      ).length,
    };

    return res.status(200).json({
      success: true,

      member: {
        id: user._id,
        name: user.name,
        email: user.email,
      },

      workload,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};


// To get workload of a team
const getTeamWorkload = async (req, res) => {
  try {
    const team =
      await Team.findById(
        req.params.teamId
      ).populate(
        "members",
        "name email"
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
      const count =
        await Task.countDocuments({
          assignedTo:
            member._id,
        });

      result.push({
        userId: member._id,
        name: member.name,
        totalTasks: count,
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


// To get workload of a project
const getProjectWorkload = async (req, res) => {
    try {
      const project =
        await Project.findById(
          req.params.projectId
        )
          .populate(
            "members",
            "name email"
          )
          .populate(
            "productManagers",
            "name email"
          );

      if (!project) {
        return res.status(404).json({
          success: false,
          message:
            "Project not found",
        });
      }

      const users = [
        ...project.members,
        ...project.productManagers,
      ];

      const workload = [];

      for (const user of users) {
        const taskCount =
          await Task.countDocuments(
            {
              assignedTo:
                user._id,
              project:
                project._id,
            }
          );

        workload.push({
          userId: user._id,
          name: user.name,
          totalTasks:
            taskCount,
        });
      }

      const overloaded =
        workload.filter(
          (user) =>
            user.totalTasks >= 10
        );

      return res.status(200).json({
        success: true,
        project:
          project.title,

        workload,

        overloadedMembers:
          overloaded,
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
  getMemberWorkload,
  getTeamWorkload,
  getProjectWorkload,
};