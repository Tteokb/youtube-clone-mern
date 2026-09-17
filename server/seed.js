import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Channel from "./models/Channel.js";
import Video from "./models/Video.js";
import Comment from "./models/Comment.js";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // 1. Wipe existing data
    await User.deleteMany({});
    await Channel.deleteMany({});
    await Video.deleteMany({});
    await Comment.deleteMany({});

    // 2. Create sample demo user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    const user = await User.create({
      username: "JohnDoe",
      email: "john@example.com",
      password: hashedPassword,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
    });

    // 3. Create demo channel owned by user
    const channel = await Channel.create({
      channelName: "Code with John",
      owner: user._id,
      description: "Coding tutorials and tech reviews by John Doe.",
      channelBanner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200",
      subscribers: 5200,
      videos: []
    });

    user.channels.push(channel._id);
    await user.save();

    // 4. Create videos across 6+ categories
    const videosData = [
      {
        title: "Learn React in 30 Minutes",
        videoUrl: "https://www.youtube.com/watch?v=hQAHSlTtcmY",
        thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600",
        description: "A quick tutorial to get started with React fundamentals.",
        category: "Web Development",
        channelId: channel._id,
        uploader: user._id,
        views: 15200,
        likes: [user._id],
        dislikes: []
      },
      {
        title: "JavaScript ES6 Mastery Course",
        videoUrl: "https://www.youtube.com/watch?v=NCwa_xi0Uuc",
        thumbnailUrl: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600",
        description: "Arrow functions, destructuring, promises, and async/await.",
        category: "JavaScript",
        channelId: channel._id,
        uploader: user._id,
        views: 8900,
        likes: [],
        dislikes: []
      },
      {
        title: "Binary Search Tree Explained Simply",
        videoUrl: "https://www.youtube.com/watch?v=f5dU3xoE6ms",
        thumbnailUrl: "https://images.unsplash.com/photo-1516116211227-bbc13c2441f6?w=600",
        description: "Everything you need to know about BST operations.",
        category: "Data Structures",
        channelId: channel._id,
        uploader: user._id,
        views: 4200,
        likes: [],
        dislikes: []
      },
      {
        title: "Chill Lofi Beats to Code/Study To",
        videoUrl: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
        thumbnailUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600",
        description: "Calm music for studying, reading, and software development.",
        category: "Music",
        channelId: channel._id,
        uploader: user._id,
        views: 23100,
        likes: [],
        dislikes: []
      },
      {
        title: "Top 10 RPGs Coming in 2026",
        videoUrl: "https://www.youtube.com/watch?v=21X5lGlDOfg",
        thumbnailUrl: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600",
        description: "A complete countdown of the most anticipated upcoming RPG games.",
        category: "Gaming",
        channelId: channel._id,
        uploader: user._id,
        views: 6500,
        likes: [],
        dislikes: []
      },
      {
        title: "Tech Talks: The Future of Cloud and AI",
        videoUrl: "https://www.youtube.com/watch?v=aircAruvnKk",
        thumbnailUrl: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600",
        description: "Industry experts discuss the next decade of full-stack engineering.",
        category: "Podcasts",
        channelId: channel._id,
        uploader: user._id,
        views: 11200,
        likes: [],
        dislikes: []
      }
    ];

    const createdVideos = await Video.insertMany(videosData);

    // Link videos to Channel
    channel.videos = createdVideos.map((v) => v._id);
    await channel.save();

    // 5. Create an initial comment
    await Comment.create({
      videoId: createdVideos[0]._id,
      userId: user._id,
      text: "Great video! Very helpful."
    });

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedData();