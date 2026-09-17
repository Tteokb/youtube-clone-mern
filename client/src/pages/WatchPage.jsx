import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { ThumbsUp, ThumbsDown, Trash2, Edit2, Check } from "lucide-react";
import API from "../services/api.js";
import { AuthContext } from "../context/AuthContext.jsx";

export default function WatchPage() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  useEffect(() => {
    const fetchVideoAndComments = async () => {
      try {
        const vidRes = await API.get(`/videos/${id}`);
        setVideo(vidRes.data);
        const commentRes = await API.get(`/comments/${id}`);
        setComments(commentRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchVideoAndComments();
  }, [id]);

  const handleLike = async () => {
    if (!user) return alert("Please sign in to like");
    const res = await API.post(`/videos/${id}/like`);
    setVideo({ ...video, likes: new Array(res.data.likes), dislikes: new Array(res.data.dislikes) });
  };

  const handleDislike = async () => {
    if (!user) return alert("Please sign in to dislike");
    const res = await API.post(`/videos/${id}/dislike`);
    setVideo({ ...video, likes: new Array(res.data.likes), dislikes: new Array(res.data.dislikes) });
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please sign in to comment");
    if (!commentText.trim()) return;

    try {
      const res = await API.post(`/comments/${id}`, { text: commentText });
      setComments([res.data, ...comments]);
      setCommentText("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await API.delete(`/comments/${commentId}`);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateComment = async (commentId) => {
    try {
      await API.put(`/comments/${commentId}`, { text: editCommentText });
      setComments(comments.map((c) => (c._id === commentId ? { ...c, text: editCommentText } : c)));
      setEditingCommentId(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (!video) return <div style={{ padding: "20px" }}>Loading video...</div>;

  return (
    <div style={{ flex: 1, padding: "24px", maxWidth: "1000px", margin: "0 auto" }}>
      <video
        src={video.videoUrl}
        controls
        autoPlay
        style={{ width: "100%", maxHeight: "550px", background: "#000", borderRadius: "12px" }}
      />
      <h2 style={{ marginTop: "14px", fontSize: "20px" }}>{video.title}</h2>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "12px 0", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h4 style={{ margin: 0 }}>{video.channelId?.channelName}</h4>
          <p style={{ margin: 0, fontSize: "12px", color: "#aaa" }}>{video.channelId?.subscribers?.toLocaleString()} subscribers</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={handleLike} style={{ display: "flex", alignItems: "center", gap: "6px", background: "#272727", color: "#fff", padding: "8px 14px", borderRadius: "18px" }}>
            <ThumbsUp size={16} /> {video.likes?.length || 0}
          </button>
          <button onClick={handleDislike} style={{ display: "flex", alignItems: "center", gap: "6px", background: "#272727", color: "#fff", padding: "8px 14px", borderRadius: "18px" }}>
            <ThumbsDown size={16} /> {video.dislikes?.length || 0}
          </button>
        </div>
      </div>

      <div style={{ background: "#272727", padding: "12px", borderRadius: "8px", fontSize: "14px", marginBottom: "24px" }}>
        <p style={{ fontWeight: "bold", margin: "0 0 6px 0" }}>{video.views?.toLocaleString()} views</p>
        <p style={{ margin: 0 }}>{video.description}</p>
      </div>

      {/* Comments CRUD */}
      <h3 style={{ marginBottom: "14px" }}>{comments.length} Comments</h3>
      {user && (
        <form onSubmit={handleAddComment} style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            style={{ flex: 1, padding: "10px", background: "#121212", border: "1px solid #303030", borderRadius: "4px", color: "#fff" }}
          />
          <button type="submit" style={{ padding: "10px 16px", background: "#3ea6ff", color: "#000", borderRadius: "4px", fontWeight: "bold" }}>
            Comment
          </button>
        </form>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {comments.map((c) => (
          <div key={c._id} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <img src={c.userId?.avatar || "https://via.placeholder.com/35"} alt="avatar" style={{ width: "32px", height: "32px", borderRadius: "50%" }} />
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: "13px", fontWeight: "bold" }}>{c.userId?.username}</span>
              {editingCommentId === c._id ? (
                <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                  <input
                    type="text"
                    value={editCommentText}
                    onChange={(e) => setEditCommentText(e.target.value)}
                    style={{ flex: 1, padding: "6px", background: "#121212", border: "1px solid #444", color: "#fff", borderRadius: "4px" }}
                  />
                  <button onClick={() => handleUpdateComment(c._id)} style={{ background: "#2ba640", color: "#fff", padding: "6px", borderRadius: "4px" }}><Check size={16} /></button>
                </div>
              ) : (
                <p style={{ margin: "4px 0 0 0", fontSize: "14px" }}>{c.text}</p>
              )}
            </div>
            {user && user.userId === c.userId?._id && (
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => { setEditingCommentId(c._id); setEditCommentText(c.text); }} style={{ background: "transparent", color: "#aaa" }}><Edit2 size={15} /></button>
                <button onClick={() => handleDeleteComment(c._id)} style={{ background: "transparent", color: "#ff4444" }}><Trash2 size={15} /></button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}