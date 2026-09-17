import Channel from "../models/Channel.js";
import User from "../models/User.js";

// Create a new channel (Protected)
export const createChannel = async (req, res) => {
  try {
    const { channelName, description, channelBanner } = req.body;

    if (!channelName) {
      return res.status(400).json({ message: "Channel name is required" });
    }

    const newChannel = await Channel.create({
      channelName,
      description: description || "",
      channelBanner: channelBanner || "https://via.placeholder.com/1200x300",
      owner: req.user.id
    });

    // Link channel to user record
    await User.findByIdAndUpdate(req.user.id, {
      $push: { channels: newChannel._id }
    });

    res.status(201).json(newChannel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get channel details along with its videos
export const getChannelById = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id)
      .populate("owner", "username avatar")
      .populate("videos");

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    res.status(200).json(channel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};