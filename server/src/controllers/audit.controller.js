const getProjectAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find({
      project: req.params.projectId,
    })
      .populate("performedBy", "name email")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      logs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getOrganizationAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find({
      organization: req.params.organizationId,
    })
      .populate("performedBy", "name email")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      logs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  getProjectAuditLogs,
  getOrganizationAuditLogs,
};