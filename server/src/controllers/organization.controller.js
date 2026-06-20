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

    const existingOrganization = await Organization.findOne({
      owner: req.user._id,
    });

    if (existingOrganization) {
      return res.status(400).json({
        success: false,
        message: "You already own an organization",
      });
    }

    const organization = await Organization.create({
      name,
      description,
      owner: req.user._id,
      members: [req.user._id],
    });

    await User.findByIdAndUpdate(req.user._id, {
      role: "ORG_ADMIN",
      organization: organization._id,
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
const getMyOrganization = async (req, res) => {
  try {
    const organization =
      await Organization.findOne({
        members: req.user._id,
      })
        .populate(
          "owner",
          "name email role"
        )
        .populate(
          "members",
          "name email role"
        );

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

module.exports = {
  createOrganization,
  getOrganizationById,
  getMyOrganization,
};