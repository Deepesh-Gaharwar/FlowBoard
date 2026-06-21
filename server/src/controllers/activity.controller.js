const Activity = require("../models/Activity");


// To get all activities of a project
const getProjectActivities = async (req, res) => {
  try {
    const activities =
      await Activity.find({
        project: req.params.projectId,
      })
        .populate(
          "user",
          "name email role"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: activities.length,
      activities,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// To get all activities of a task
const getTaskActivities = async (
  req,
  res
) => {
  try {
    const activities =
      await Activity.find({
        task: req.params.taskId,
      })
        .populate(
          "user",
          "name email role"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: activities.length,
      activities,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  getProjectActivities,
  getTaskActivities,
};