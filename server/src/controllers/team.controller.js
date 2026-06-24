const Team = require("../models/Team");
const User = require("../models/User");
const Organization = require("../models/Organization");

// To create a team inside an organization
const createTeam = async (req, res) => {
  try {
    const {
      name,
      description,
      organizationId,
    } = req.body;

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

    const team = await Team.create({
      name,
      description,
      organization:
        organizationId,
      createdBy: req.user._id,
    });

    organization.teams.push(
      team._id
    );

    await organization.save();

    await createActivity({
      organization: team.organization,

      user: req.user._id,

      action: "TEAM_CREATED",

      message: `${req.user.name} created team ${team.name}`,
    });

    return res.status(201).json({
      success: true,
      message:
        "Team created successfully",
      team,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// To get team details
const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId)
      .populate("productManagers", "name email role")
      .populate("teamLead", "name email role")
      .populate("members", "name email role");

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    return res.status(200).json({
      success: true,
      team,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// To get all teams of an organization
const getOrganizationTeams = async (req, res) => {
    try {
      const teams =
        await Team.find({
          organization:
            req.params
              .organizationId,
        })
          .populate(
            "teamLead",
            "name email role"
          )
          .populate(
            "members",
            "name email role"
          );

      return res.status(200).json({
        success: true,
        teams,
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

// To assign Product manager
const assignProductManager = async (req, res) => {
  try {
    const { userId } = req.body;

    const team = await Team.findById(req.params.teamId);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    if (!team.productManagers.includes(userId)) {
      team.productManagers.push(userId);
    }

    await team.save();

    return res.status(200).json({
      success: true,
      message: "Product Manager assigned",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// To assign a team lead
const assignTeamLead = async (req, res) => {
    try {
      const { userId } =
        req.body;

      const team =
        await Team.findById(
          req.params.teamId
        );

      const user =
        await User.findById(
          userId
        );

      if (!team || !user) {
        return res.status(404).json({
          success: false,
          message:
            "Team or user not found",
        });
      }

      team.teamLead = userId;

      if (
        !team.members.includes(
          userId
        )
      ) {
        team.members.push(
          userId
        );
      }

      await team.save();

      await User.findByIdAndUpdate(
        userId,
        {
          role: "TEAM_LEAD",
        }
      );

      await createActivity({
        organization: team.organization,

        user: req.user._id,

        action: "TEAM_LEAD_ASSIGNED",

        message: `${req.user.name} assigned ${user.name} as Team Lead of ${team.name}`,
      });

      return res.status(200).json({
        success: true,
        message:
          "Team lead assigned successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };


// To add a member to team
const addMemberToTeam = async (req, res) => {
    try {
      const { userId } =
        req.body;

      const team =
        await Team.findById(
          req.params.teamId
        );

      if (!team) {
        return res.status(404).json({
          success: false,
          message:
            "Team not found",
        });
      }

      if (
        team.members.includes(
          userId
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "User already in team",
        });
      }

      team.members.push(
        userId
      );

      await team.save();

      await createActivity({
        organization: team.organization,

        user: req.user._id,

        action: "MEMBER_ADDED_TO_TEAM",

        message: `${req.user.name} added ${user.name} to ${team.name}`,
      });

      return res.status(200).json({
        success: true,
        message:
          "Member added successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };


// To remove a member from team
const removeMemberFromTeam = async (req, res) => {
    try {
      const { userId } =
        req.body;

      const user = await User.findById(userId);

      const team =
        await Team.findById(
          req.params.teamId
        );

      team.members =
        team.members.filter(
          (member) =>
            member.toString() !==
            userId
        );

      await team.save();

      await createActivity({
        organization: team.organization,

        user: req.user._id,

        action: "MEMBER_REMOVED_FROM_TEAM",

        message: `${req.user.name} removed ${member.name}`,
      });

      return res.status(200).json({
        success: true,
        message:
          "Member removed successfully",
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
    createTeam,
    getTeamById,
    getOrganizationTeams,
    assignProductManager,
    assignTeamLead,
    addMemberToTeam,
    removeMemberFromTeam,
  };