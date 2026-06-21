// To add a comment on a task
const createComment = async (req, res) => {
  try {
    const {
      taskId,
      content,
    } = req.body;

    const task =
      await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const comment =
      await Comment.create({
        task: taskId,
        author: req.user._id,
        content,
      });

    task.comments.push(
      comment._id
    );

    await task.save();

    await createActivity({
      project: task.project,
      task: task._id,

      user: req.user._id,

      action: "COMMENT_ADDED",

      message: `${req.user.name} commented on ${task.taskKey}`,
    });

    return res.status(201).json({
      success: true,
      message:
        "Comment added successfully",
      comment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

// To get comments of a task
const getTaskComments = async (req, res) => {
    try {
      const comments =
        await Comment.find({
          task:
            req.params.taskId,
        })
          .populate(
            "author",
            "name email role"
          )
          .sort({
            createdAt: 1,
          });

      return res.status(200).json({
        success: true,
        comments,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };


  // To update comment
const updateComment = async (req, res) => {
    try {
      const comment =
        await Comment.findById(
          req.params.commentId
        );

      if (!comment) {
        return res.status(404).json({
          success: false,
          message:
            "Comment not found",
        });
      }

      if (
        comment.author.toString() !==
        req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Unauthorized",
        });
      }

      comment.content =
        req.body.content;

      comment.edited = true;

      await comment.save();

      await createActivity({
        project: task.project,
        task: task._id,

        user: req.user._id,

        action: "COMMENT_UPDATED",

        message: `${req.user.name} updated a comment on ${task.taskKey}`,
      });

      return res.status(200).json({
        success: true,
        message:
          "Comment updated successfully",
        comment,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };


 // To delete comment
const deleteComment = async (
  req,
  res
) => {
  try {
    const comment =
      await Comment.findById(
        req.params.commentId
      );

    if (!comment) {
      return res.status(404).json({
        success: false,
        message:
          "Comment not found",
      });
    }

    if (
      comment.author.toString() !==
        req.user._id.toString() &&
      req.user.role !==
        "ORG_ADMIN"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Unauthorized",
      });
    }

    await Task.findByIdAndUpdate(
      comment.task,
      {
        $pull: {
          comments: comment._id,
        },
      }
    );

    await Comment.findByIdAndDelete(
      comment._id
    );

    return res.status(200).json({
      success: true,
      message:
        "Comment deleted successfully",
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
    createComment,
    getTaskComments,
    updateComment,
    deleteComment
}