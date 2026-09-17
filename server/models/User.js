import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "https://via.placeholder.com/150" },
    channels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Channel" }]
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);