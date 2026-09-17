import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { Trash2, Edit2, PlusCircle } from "lucide-react";
import API from "../services/api.js";
import { AuthContext } from "../context/AuthContext.jsx";

export default function ChannelPage() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [channel, setChannel] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [newVideo, setNewVideo] = useState({
    title: "",
    videoUrl: "",
    thumbnailUrl: "",
    description: "",
    category: "Web Development"
  });

  const fetchChannel = async () => {
    try {
      const res = await API.get(`/channels/${id}`);
      setChannel(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchChannel();
  }, [id]);

  const handleCreateVideo = async (e) => {
    e.preventDefault();
    try {
      await API.post("/videos", { ...newVideo, channelId: id });
      setShowUpload(false);
      setNewVideo({ title: "", videoUrl: "", thumbnailUrl: "", description: "", category: "Web Development" });
      fetchChannel();
    } catch (err) {
      alert("Failed to create video");
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;
    try {
      await API.delete(`/videos/${videoId}`);
      fetchChannel();
    } catch (err) {
      alert("Failed to delete video");
    }
  };

  if (!channel) return <div style={{ padding: "20px" }}>Loading channel...</div>;
  const isOwner = user && user.userId === channel.owner?._id;

  return (
    <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
      <img src={channel.channelBanner} alt="Banner" style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "12px" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "16px 0" }}>
        <div>
          <h2>{channel.channelName}</h2>
          <p style={{ color: "#aaa", fontSize: "14px" }}>{channel.description}</p>
        </div>
        {isOwner && (
          <button onClick={() => setShowUpload(!showUpload)} style={{ display: "flex", alignItems: "center", gap: "6px", background: "#cc0000", color: "#fff", padding: "8px 16px", borderRadius: "6px", fontWeight: "bold" }}>
            <PlusCircle size={18} /> Upload Video
          </button>
        )}
      </div>

      {showUpload && (
        <form onSubmit={handleCreateVideo} style={{ background: "#212121", padding: "16px", borderRadius: "8px", marginBottom: "24px", display: "flex", flexDirection: "column", gap: "10px", maxWidth: "500px" }}>
          <h4>Upload a New Video</h4>
          <input type="text" placeholder="Title" required value={newVideo.title} onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })} style={{ padding: "8px", background: "#121212", border: "1px solid #444", color: "#fff" }} />
          <input type="text" placeholder="Video URL (.mp4)" required value={newVideo.videoUrl} onChange={(e) => setNewVideo({ ...newVideo, videoUrl: e.target.value })} style={{ padding: "8px", background: "#121212", border: "1px solid #444", color: "#fff" }} />
          <input type="text" placeholder="Thumbnail Image URL" required value={newVideo.thumbnailUrl} onChange={(e) => setNewVideo({ ...newVideo, thumbnailUrl: e.target.value })} style={{ padding: "8px", background: "#121212", border: "1px solid #444", color: "#fff" }} />
          <textarea placeholder="Description" value={newVideo.description} onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })} style={{ padding: "8px", background: "#121212", border: "1px solid #444", color: "#fff" }} />
          <select value={newVideo.category} onChange={(e) => setNewVideo({ ...newVideo, category: e.target.value })} style={{ padding: "8px", background: "#121212", border: "1px solid #444", color: "#fff" }}>
            {["Web Development", "JavaScript", "Data Structures", "Gaming", "Music", "Podcasts"].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button type="submit" style={{ padding: "8px", background: "#3ea6ff", color: "#000", fontWeight: "bold" }}>Submit Video</button>
        </form>
      )}

      <h3>Uploaded Videos</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "16px", marginTop: "14px" }}>
        {channel.videos?.map((vid) => (
          <div key={vid._id} style={{ background: "#1c1c1c", borderRadius: "8px", overflow: "hidden" }}>
            <Link to={`/watch/${vid._id}`}>
              <img src={vid.thumbnailUrl} alt={vid.title} style={{ width: "100%", height: "140px", objectFit: "cover" }} />
            </Link>
            <div style={{ padding: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ overflow: "hidden" }}>
                <h5 style={{ margin: "0 0 4px 0", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>{vid.title}</h5>
                <p style={{ margin: 0, fontSize: "12px", color: "#aaa" }}>{vid.views} views</p>
              </div>
              {isOwner && (
                <button onClick={() => handleDeleteVideo(vid._id)} style={{ background: "transparent", color: "#ff4444" }} title="Delete video">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}