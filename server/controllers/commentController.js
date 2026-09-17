import Comment from "../models/Comment.js";

// Fetch comments for a specific video
export const getCommentsByVideo = async (req, res) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId })
      .populate("userId", "username avatar")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a comment to a video (Protected)
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { videoId } = req.params;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text cannot be empty" });
    }

    const comment = await Comment.create({
      videoId,
      userId: req.user.id,
      text
    });

    const populated = await comment.populate("userId", "username avatar");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an existing comment (Protected - Author only)
export const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to edit this comment" });
    }

    comment.text = req.body.text || comment.text;
    await comment.save();

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a comment (Protected - Author only)
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};