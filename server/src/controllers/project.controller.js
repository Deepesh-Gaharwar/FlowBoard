const Project = require("../models/Project");
const Organization = require("../models/Organization");

// To create a new project
const createProject = async (req, res) => {
  try {
    const {
      projectKey,
      title,
      description,
      organizationId,
      projectVisibility,
      priority,
      startDate,
      deadline,
      estimatedCompletionDate,
    } = req.body;

    if (
      !projectKey ||
      !title ||
      !organizationId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Project key, title and organization are required",
      });
    }

    const existingProject =
      await Project.findOne({
        projectKey,
      });

    if (existingProject) {
      return res.status(400).json({
        success: false,
        message:
          "Project key already exists",
      });
    }

    const organization =
      await Organization.findById(
        organizationId
      );

    if (!organization) {
      return res.status(404).json({
        success: false,
        message:
          "Organization not found",
      });
    }

    const project =
      await Project.create({
        projectKey,
        title,
        description,
        organization:
          organizationId,

        productManagers: [
          req.user._id,
        ],

        projectVisibility,
        priority,

        startDate,
        deadline,
        estimatedCompletionDate,

        createdBy:
          req.user._id,
      });

    organization.projects.push(
      project._id
    );

    await organization.save();

    return res.status(201).json({
      success: true,
      message:
        "Project created successfully",
      project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

// To get project details
const getProjectById =
  async (req, res) => {
    try {
      const project =
        await Project.findById(
          req.params.projectId
        )
          .populate(
            "productManagers",
            "name email role"
          )
          .populate(
            "members",
            "name email role"
          )
          .populate(
            "viewers",
            "name email role"
          )
          .populate(
            "teams",
            "name"
          );

      if (!project) {
        return res.status(404).json({
          success: false,
          message:
            "Project not found",
        });
      }

      return res.status(200).json({
        success: true,
        project,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };


  // To get all projects of an organization
const getOrganizationProjects =
  async (req, res) => {
    try {
      const projects =
        await Project.find({
          organization:
            req.params
              .organizationId,
        });

      return res.status(200).json({
        success: true,
        projects,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };


  // To update project details
const updateProject =
  async (req, res) => {
    try {
      const project =
        await Project.findByIdAndUpdate(
          req.params.projectId,
          req.body,
          {
            new: true,
          }
        );

      return res.status(200).json({
        success: true,
        message:
          "Project updated successfully",
        project,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };


// To delete a project
const deleteProject =
  async (req, res) => {
    try {
      await Project.findByIdAndDelete(
        req.params.projectId
      );

      return res.status(200).json({
        success: true,
        message:
          "Project deleted successfully",
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
  createProject,
  getProjectById,
  getOrganizationProjects,
  updateProject,
  deleteProject,
};