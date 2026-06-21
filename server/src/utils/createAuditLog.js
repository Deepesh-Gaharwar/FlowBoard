const AuditLog = require("../models/AuditLog");

const createAuditLog = async ({
  organization = null,
  project = null,
  entityType,
  entityId,
  action,
  performedBy,
  details,
}) => {
  try {
    await AuditLog.create({
      organization,
      project,
      entityType,
      entityId,
      action,
      performedBy,
      details,
    });
  } catch (error) {
    console.log("Audit Log Error:", error.message);
  }
};

module.exports = createAuditLog;
