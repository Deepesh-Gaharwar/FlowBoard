const Notification = require("../models/Notification");

const createNotification = async ({
  recipient,
  sender,
  title,
  message,
  type,
  task = null,
  project = null,
}) => {
  try {
    await Notification.create({
      recipient,
      sender,
      title,
      message,
      type,
      task,
      project,
    });
  } catch (error) {
    console.log("Notification Error:", error.message);
  }
};

module.exports = createNotification;
