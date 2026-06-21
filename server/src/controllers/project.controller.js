const Project = require("../models/Project");
const Organization = require("../models/Organization");
const User = require("../models/User");
const Team = require("../models/Team");

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

    await createActivity({
      organization: project.organization,
      project: project._id,

      user: req.user._id,

      action: "PROJECT_CREATED",

      message: `${req.user.name} created project ${project.title}`,
    });

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
const updateProject = async (req, res) => {
    try {
      const project =
        await Project.findByIdAndUpdate(
          req.params.projectId,
          req.body,
          {
            new: true,
          }
        );

        await createActivity({
          organization: project.organization,
          project: project._id,

          user: req.user._id,

          action: "PROJECT_UPDATED",

          message: `${req.user.name} updated project ${project.title}`,
        });

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


// To add a product manager to project
const addProductManager = async (req, res) => {
  try {
    const { userId } = req.body;

    const project = await Project.findById(
      req.params.projectId
    );

    const user = await User.findById(userId);

    if (!project || !user) {
      return res.status(404).json({
        success: false,
        message: "Project or User not found",
      });
    }

    if (
      project.productManagers.includes(userId)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "User already a product manager",
      });
    }

    project.productManagers.push(userId);

    await project.save();

    if (
      !user.projects.includes(project._id)
    ) {
      user.projects.push(project._id);
      await user.save();
    }

    await createActivity({
      organization: project.organization,
      project: project._id,

      user: req.user._id,

      action: "PRODUCT_MANAGER_ADDED",

      message: `${req.user.name} added ${targetUser.name} as Product Manager`,
    });

    return res.status(200).json({
      success: true,
      message:
        "Product manager added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// To remove a product manager
const removeProductManager = async (req, res) => {
  try {
    const { userId } = req.body;

    const project = await Project.findById(
      req.params.projectId
    );

    const user = await User.findById(userId);

    if (!project || !user) {
      return res.status(404).json({
        success: false,
        message: "Project or User not found",
      });
    }

    project.productManagers.pull(userId);

    user.projects.pull(project._id);

    await project.save();
    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Product manager removed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// To add a team to project
const addTeam = async (req, res) => {
  try {
    const { teamId } = req.body;

    const project = await Project.findById(
      req.params.projectId
    );

    const team = await Team.findById(teamId);

    if (!project || !team) {
      return res.status(404).json({
        success: false,
        message: "Project or Team not found",
      });
    }

    if (
      project.teams.includes(teamId)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Team already assigned",
      });
    }

    project.teams.push(teamId);

    await project.save();

    await createActivity({
      organization: project.organization,
      project: project._id,

      user: req.user._id,

      action: "TEAM_ADDED_TO_PROJECT",

      message: `${req.user.name} added ${team.name} to project ${project.title}`,
    });

    return res.status(200).json({
      success: true,
      message:
        "Team added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// To remove a team from project
const removeTeam = async (req, res) => {
  try {
    const { teamId } = req.body;

    const project = await Project.findById(
      req.params.projectId
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    project.teams.pull(teamId);

    await project.save();

    return res.status(200).json({
      success: true,
      message:
        "Team removed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// To add a member to project
const addMember = async (req, res) => {
  try {
    const { userId } = req.body;

    const project = await Project.findById(
      req.params.projectId
    );

    const user = await User.findById(userId);

    if (!project || !user) {
      return res.status(404).json({
        success: false,
        message: "Project or User not found",
      });
    }

    if (
      project.members.includes(userId)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "User already a member",
      });
    }

    project.members.push(userId);

    await project.save();

    if (
      !user.projects.includes(project._id)
    ) {
      user.projects.push(project._id);
      await user.save();
    }

    await createActivity({
      organization: project.organization,
      project: project._id,

      user: req.user._id,

      action: "MEMBER_ADDED_TO_PROJECT",

      message: `${req.user.name} added ${member.name} to project ${project.title}`,
    });

    return res.status(200).json({
      success: true,
      message:
        "Member added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// To remove a member from project
const removeMember = async (req, res) => {
  try {
    const { userId } = req.body;

    const project = await Project.findById(
      req.params.projectId
    );

    const user = await User.findById(userId);

    if (!project || !user) {
      return res.status(404).json({
        success: false,
        message: "Project or User not found",
      });
    }

    project.members.pull(userId);

    user.projects.pull(project._id);

    await project.save();
    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Member removed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
 

// To add a viewer to project
const addViewer = async (req, res) => {
  try {
    const { userId } = req.body;

    const project = await Project.findById(
      req.params.projectId
    );

    const user = await User.findById(userId);

    if (!project || !user) {
      return res.status(404).json({
        success: false,
        message: "Project or User not found",
      });
    }

    if (
      project.viewers.includes(userId)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "User already a viewer",
      });
    }

    project.viewers.push(userId);

    await project.save();

    if (
      !user.projects.includes(project._id)
    ) {
      user.projects.push(project._id);
      await user.save();
    }

    await createActivity({
      organization: project.organization,
      project: project._id,

      user: req.user._id,

      action: "VIEWER_ADDED_TO_PROJECT",

      message: `${req.user.name} added ${viewer.name} as Viewer`,
    });

    return res.status(200).json({
      success: true,
      message:
        "Viewer added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// To remove a viewer from project
const removeViewer = async (req, res) => {
  try {
    const { userId } = req.body;

    const project = await Project.findById(
      req.params.projectId
    );

    const user = await User.findById(userId);

    if (!project || !user) {
      return res.status(404).json({
        success: false,
        message: "Project or User not found",
      });
    }

    project.viewers.pull(userId);

    user.projects.pull(project._id);

    await project.save();
    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Viewer removed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProject,
  getProjectById,
  getOrganizationProjects,
  updateProject,
  deleteProject,

  addProductManager,
  removeProductManager,

  addTeam,
  removeTeam,

  addMember,
  removeMember,

  addViewer,
  removeViewer,
};