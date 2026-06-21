const Task = require("../models/Task");
const Sprint = require("../models/Sprint");
const Project = require("../models/Project");
const User = require("../models/User");
const createNotification = require("../utils/createNotification");

// To create a task
const createTask = async (req, res) => {
  try {
    const {
      taskKey,
      title,
      description,
      projectId,
      sprintId,
      priority,
      labels,
    } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    let sprint = null;

    if (sprintId) {
      sprint = await Sprint.findById(sprintId);

      if (!sprint) {
        return res.status(404).json({
          success: false,
          message: "Sprint not found",
        });
      }
    }

    const task = await Task.create({
      taskKey,
      title,
      description,
      project: projectId,
      sprint: sprintId || null,
      priority,
      labels,
      createdBy: req.user._id,
    });

    project.tasks.push(task._id);

    await project.save();

    if (sprint) {
      sprint.tasks.push(task._id);
      await sprint.save();
    }

    await createActivity({
      project: project._id,
      task: task._id,
      user: req.user._id,

      action: "TASK_CREATED",

      message: `${req.user.name} created task ${task.taskKey}`,
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// To get task details
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId)
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// To get all project tasks
const getProjectTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      project: req.params.projectId,
    });

    return res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// To get all sprint tasks
const getSprintTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      sprint: req.params.sprintId,
    });

    return res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// To assign a task
const assignTask = async (req, res) => {
  try {
    const { userId } = req.body;

    const task = await Task.findById(req.params.taskId);

    const user = await User.findById(userId);

    if (!task || !user) {
      return res.status(404).json({
        success: false,
        message: "Task or User not found",
      });
    }

    task.assignedTo = userId;

    await task.save();

    await createNotification({
      recipient: user._id,

      sender: req.user._id,

      title: "Task Assigned",

      message: `${req.user.name} assigned ${task.taskKey} to you`,

      type: "TASK_ASSIGNED",

      task: task._id,

      project: task.project,
    });

    await createActivity({
      project: task.project,
      task: task._id,
      user: req.user._id,

      action: "TASK_ASSIGNED",

      message: `${req.user.name} assigned ${task.taskKey} to ${user.name}`,
    });

    return res.status(200).json({
      success: true,
      message: "Task assigned successfully",
      task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// To update task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.taskId, req.body, {
      new: true,
    });

    await createActivity({
      project: task.project,
      task: task._id,

      user: req.user._id,

      action: "TASK_UPDATED",

      message: `${req.user.name} updated task ${task.taskKey}`,
    });

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// To delete a task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(
      req.params.taskId
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    await Project.findByIdAndUpdate(
      task.project,
      {
        $pull: {
          tasks: task._id,
        },
      }
    );

    if (task.sprint) {
      await Sprint.findByIdAndUpdate(
        task.sprint,
        {
          $pull: {
            tasks: task._id,
          },
        }
      );
    }

    await Task.findByIdAndDelete(
      task._id
    );

    await createActivity({
      project: task.project,

      task: task._id,

      user: req.user._id,

      action: "TASK_DELETED",

      message: `${req.user.name} deleted task ${task.taskKey}`,
    });

    await createAuditLog({
      project: task.project,

      entityType: "TASK",

      entityId: task._id,

      action: "TASK_DELETED",

      performedBy: req.user._id,

      details: `${req.user.name} deleted task ${task.taskKey}`,
    });

    return res.status(200).json({
      success: true,
      message:
        "Task deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

// Status APIs - Start task
const startTask = async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.taskId,
    {
      status: "IN_PROGRESS",
    },
    { new: true },
  );

  await createActivity({
    project: task.project,
    task: task._id,

    user: req.user._id,

    action: "TASK_STARTED",

    message: `${req.user.name} started task ${task.taskKey}`,
  });

  return res.status(200).json({
    success: true,
    task,
  });
};


// Status APIs - Review task
const reviewTask = async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.taskId,
    {
      status: "IN_REVIEW",
    },
    { new: true },
  );

  await createActivity({
    project: task.project,
    task: task._id,

    user: req.user._id,

    action: "TASK_REVIEWED",

    message: `${req.user.name} moved ${task.taskKey} to review`,
  });

  return res.status(200).json({
    success: true,
    task,
  });
};


// Status APIs - Complete task
const completeTask = async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.taskId,
    {
      status: "DONE",
    },
    { new: true },
  );

  await createActivity({
    project: task.project,
    task: task._id,

    user: req.user._id,

    action: "TASK_COMPLETED",

    message: `${req.user.name} completed ${task.taskKey}`,
  });

  return res.status(200).json({
    success: true,
    task,
  });
};


// Status APIs - Block task
const blockTask = async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.taskId,
    {
      status: "BLOCKED",
    },
    { new: true },
  );

  await createActivity({
    project: task.project,
    task: task._id,

    user: req.user._id,

    action: "TASK_BLOCKED",

    message: `${req.user.name} blocked ${task.taskKey}`,
  });

  return res.status(200).json({
    success: true,
    task,
  });
};


// To filter project tasks
const filterProjectTasks = async (req, res) => {
  try {
    const {
      status,
      priority,
      assignedTo,
      label,
      sprintId,
      taskKey,
      search,
      sortBy,
    } = req.query;

    const query = {
      project: req.params.projectId,
    };

    // Status Filter
    if (status) {
      query.status = status;
    }

    // Priority Filter
    if (priority) {
      query.priority = priority;
    }

    // Assignee Filter
    if (assignedTo) {
      query.assignedTo = assignedTo;
    }

    // Sprint Filter
    if (sprintId) {
      query.sprint = sprintId;
    }

    // Labels Filter
    if (label) {
      query.labels = label;
    }

    // Task Key Filter
    if (taskKey) {
      query.taskKey = {
        $regex: taskKey,
        $options: "i",
      };
    }

    // Search By Title
    if (search) {
      query.title = {
        $regex: search,
        $options: "i",
      };
    }

    let sort = {
      createdAt: -1,
    };

    // Oldest
    if (sortBy === "oldest") {
      sort = {
        createdAt: 1,
      };
    }

    // Priority
    if (sortBy === "priority") {
      sort = {
        priority: 1,
      };
    }

    // Status
    if (sortBy === "status") {
      sort = {
        status: 1,
      };
    }

    const tasks = await Task.find(
      query
    )
      .populate(
        "assignedTo",
        "name email role"
      )
      .populate(
        "sprint",
        "sprintName"
      )
      .sort(sort);

    return res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// To get kanban board data
const getProjectBoard = async (req, res) => {
  try {
    const project =
      await Project.findById(
        req.params.projectId
      );

    if (!project) {
      return res.status(404).json({
        success: false,
        message:
          "Project not found",
      });
    }

    const tasks =
      await Task.find({
        project: project._id,
      })
        .populate(
          "assignedTo",
          "name email"
        )
        .populate(
          "sprint",
          "sprintName"
        );

    const board = {
      TODO: [],
      IN_PROGRESS: [],
      IN_REVIEW: [],
      DONE: [],
      BLOCKED: [],
    };

    tasks.forEach(task => {
      board[task.status].push(task);
    });

    return res.status(200).json({
      success: true,
      project: project.title,
      board,
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
  createTask,
  getTaskById,
  getProjectTasks,
  getSprintTasks,
  assignTask,
  updateTask,
  deleteTask,
  startTask,
  reviewTask,
  completeTask,
  blockTask,
  filterProjectTasks,
  getProjectBoard,
};