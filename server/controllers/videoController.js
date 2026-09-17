import Video from "../models/Video.js";
import Channel from "../models/Channel.js";

// Fetch videos with search and category filtering
export const getAllVideos = async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (category && category !== "All") {
      query.category = category;
    }

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const videos = await Video.find(query)
      .populate("channelId", "channelName channelBanner subscribers")
      .populate("uploader", "username avatar");

    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch single video and increment view count
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate("channelId", "channelName channelBanner subscribers")
      .populate("uploader", "username avatar");

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload/Create a new video (Protected)
export const createVideo = async (req, res) => {
  try {
    const { title, videoUrl, thumbnailUrl, description, category, channelId } = req.body;

    if (!title || !videoUrl || !thumbnailUrl || !category || !channelId) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    const newVideo = await Video.create({
      title,
      videoUrl,
      thumbnailUrl,
      description,
      category,
      channelId,
      uploader: req.user.id
    });

    // Append video reference to the Channel
    await Channel.findByIdAndUpdate(channelId, {
      $push: { videos: newVideo._id }
    });

    res.status(201).json(newVideo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update video metadata (Protected - Owner only)
export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    if (video.uploader.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this video" });
    }

    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updatedVideo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete video (Protected - Owner only)
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    if (video.uploader.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this video" });
    }

    await Video.findByIdAndDelete(req.params.id);

    // Remove reference from Channel
    await Channel.findByIdAndUpdate(video.channelId, {
      $pull: { videos: video._id }
    });

    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Like toggle
export const likeVideo = async (req, res) => {
  try {
    const userId = req.user.id;
    const video = await Video.findById(req.params.id);

    if (!video) return res.status(404).json({ message: "Video not found" });

    // Remove from dislikes if present
    await Video.findByIdAndUpdate(req.params.id, { $pull: { dislikes: userId } });

    // Toggle like
    if (video.likes.includes(userId)) {
      await Video.findByIdAndUpdate(req.params.id, { $pull: { likes: userId } });
    } else {
      await Video.findByIdAndUpdate(req.params.id, { $addToSet: { likes: userId } });
    }

    const updated = await Video.findById(req.params.id);
    res.status(200).json({ likes: updated.likes.length, dislikes: updated.dislikes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Dislike toggle
export const dislikeVideo = async (req, res) => {
  try {
    const userId = req.user.id;
    const video = await Video.findById(req.params.id);

    if (!video) return res.status(404).json({ message: "Video not found" });

    // Remove from likes if present
    await Video.findByIdAndUpdate(req.params.id, { $pull: { likes: userId } });

    // Toggle dislike
    if (video.dislikes.includes(userId)) {
      await Video.findByIdAndUpdate(req.params.id, { $pull: { dislikes: userId } });
    } else {
      await Video.findByIdAndUpdate(req.params.id, { $addToSet: { dislikes: userId } });
    }

    const updated = await Video.findById(req.params.id);
    res.status(200).json({ likes: updated.likes.length, dislikes: updated.dislikes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};