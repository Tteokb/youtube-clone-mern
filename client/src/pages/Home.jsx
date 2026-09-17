import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../services/api.js";

const categories = ["All", "Web Development", "JavaScript", "Data Structures", "Gaming", "Music", "Podcasts"];

export default function Home({ searchQuery }) {
  const [videos, setVideos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const query = new URLSearchParams();
        if (selectedCategory && selectedCategory !== "All") query.append("category", selectedCategory);
        if (searchQuery) query.append("search", searchQuery);

        const res = await API.get(`/videos?${query.toString()}`);
        setVideos(res.data);
      } catch (err) {
        console.error("Error fetching videos:", err);
      }
    };
    fetchVideos();
  }, [selectedCategory, searchQuery]);

  return (
    <div style={{ flex: 1, padding: "16px 24px", overflowY: "auto" }}>
      {/* Filter Buttons */}
      <div style={{ display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "16px" }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: "6px 14px",
              borderRadius: "8px",
              background: selectedCategory === cat ? "#f1f1f1" : "#272727",
              color: selectedCategory === cat ? "#0f0f0f" : "#f1f1f1",
              fontWeight: "500",
              fontSize: "14px",
              whiteSpace: "nowrap"
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "20px"
      }}>
        {videos.map((vid) => (
          <Link to={`/watch/${vid._id}`} key={vid._id} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <img
              src={vid.thumbnailUrl}
              alt={vid.title}
              style={{ width: "100%", height: "170px", objectFit: "cover", borderRadius: "12px" }}
            />
            <div style={{ display: "flex", gap: "12px" }}>
              <img
                src={vid.uploader?.avatar || "https://via.placeholder.com/40"}
                alt="avatar"
                style={{ width: "36px", height: "36px", borderRadius: "50%" }}
              />
              <div>
                <h4 style={{ fontSize: "15px", lineHeight: "1.2", margin: "0 0 4px 0", color: "#fff" }}>{vid.title}</h4>
                <p style={{ fontSize: "13px", color: "#aaa", margin: "0 0 2px 0" }}>{vid.channelId?.channelName}</p>
                <p style={{ fontSize: "12px", color: "#aaa", margin: 0 }}>{vid.views.toLocaleString()} views</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}