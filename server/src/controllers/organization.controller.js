const Organization = require("../models/Organization");
const User = require("../models/User");

// To create a new organization
const createOrganization = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Organization name is required",
      });
    }

    

    const organization = await Organization.create({
      name,
      description,
      owner: req.user._id,
      members: [req.user._id],
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        role: "ORG_ADMIN",
        $push: {
          organizations: organization._id,
        },
      },
      { new: true },
    );

    await createActivity({
      organization: organization._id,
      user: req.user._id,

      action: "ORG_CREATED",

      message: `${req.user.name} created organization ${organization.name}`,
    });

    return res.status(201).json({
      success: true,
      message: "Organization created successfully",
      organization,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// To get organization details by id
const getOrganizationById = async (req, res) => {
  try {
    const organization =
      await Organization.findById(
        req.params.organizationId
      )
        .populate(
          "owner",
          "name email role"
        )
        .populate(
          "members",
          "name email role"
        );

    if (!organization) {
      return res.status(404).json({
        success: false,
        message:
          "Organization not found",
      });
    }

    return res.status(200).json({
      success: true,
      organization,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// To get current user's organization
const getMyOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find({
      members: req.user._id,
    })
      .populate("owner", "name email role")
      .populate("members", "name email role");

    return res.status(200).json({
      success: true,
      organizations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all organization members
const getOrganizationMembers = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.organizationId)
      .populate("members", "name email role avatar")
      .populate("owner", "name email role");

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    return res.status(200).json({
      success: true,

      owner: organization.owner,

      totalMembers: organization.members.length,

      members: organization.members,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createOrganization,
  getOrganizationById,
  getMyOrganizations,
  getOrganizationMembers,
};