const Sprint = require("../models/Sprint");
const Project = require("../models/Project");

// To create a sprint
const createSprint = async (
  req,
  res
) => {
  try {
    const {
      sprintName,
      goal,
      projectId,
      startDate,
      endDate,
    } = req.body;

    const project =
      await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const sprint =
      await Sprint.create({
        sprintName,
        goal,
        project: projectId,
        startDate,
        endDate,
        createdBy: req.user._id,
      });

    project.sprints.push(
      sprint._id
    );

    await project.save();

    await createActivity({
      project: project._id,

      user: req.user._id,

      action: "SPRINT_CREATED",

      message: `${req.user.name} created sprint ${sprint.sprintName}`,
    });

    return res.status(201).json({
      success: true,
      message:
        "Sprint created successfully",
      sprint,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// To get sprint details
const getSprintById = async (
  req,
  res
) => {
  try {
    const sprint =
      await Sprint.findById(
        req.params.sprintId
      )
        .populate(
          "project",
          "title projectKey"
        )
        .populate(
          "createdBy",
          "name email"
        );

    if (!sprint) {
      return res.status(404).json({
        success: false,
        message: "Sprint not found",
      });
    }

    return res.status(200).json({
      success: true,
      sprint,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// To get all sprints of a project
const getProjectSprints = async (req, res) => {
    try {
      const sprints =
        await Sprint.find({
          project:
            req.params.projectId,
        });

      return res.status(200).json({
        success: true,
        sprints,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };


// To start a sprint
const startSprint = async ( req, res) => {
  try {
    const sprint =
      await Sprint.findByIdAndUpdate(
        req.params.sprintId,
        {
          status: "ACTIVE",
        },
        {
          new: true,
        }
      );

    await createActivity({
      project: sprint.project,

      user: req.user._id,

      action: "SPRINT_STARTED",

      message: `${req.user.name} started sprint ${sprint.sprintName}`,
    });

    return res.status(200).json({
      success: true,
      message:
        "Sprint started successfully",
      sprint,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// To complete a sprint
const completeSprint = async (req, res) => {
    try {
      const sprint =
        await Sprint.findByIdAndUpdate(
          req.params.sprintId,
          {
            status: "COMPLETED",
          },
          {
            new: true,
          }
        );

    await createActivity({
      project: sprint.project,

      user: req.user._id,

      action: "SPRINT_COMPLETED",

      message: `${req.user.name} completed sprint ${sprint.sprintName}`,
    });
    
      return res.status(200).json({
        success: true,
        message:
          "Sprint completed successfully",
        sprint,
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
    createSprint,
    getSprintById,
    getProjectSprints,
    startSprint,
    completeSprint,
  };