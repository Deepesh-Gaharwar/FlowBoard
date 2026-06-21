const Activity = require("../models/Activity");

const createActivity = async ({
  organization = null,
  project = null,
  task = null,
  user,
  action,
  message,
}) => {
  try {
    await Activity.create({
      organization,
      project,
      task,
      user,
      action,
      message,
    });
  } catch (error) {
    console.log("Activity Creation Error:", error.message);
  }
};

module.exports = createActivity;
