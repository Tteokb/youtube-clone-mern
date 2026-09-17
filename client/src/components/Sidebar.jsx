import React from "react";
import { Link } from "react-router-dom";
import { Home, Compass, PlaySquare, Clock, ThumbsUp } from "lucide-react";

export default function Sidebar({ isOpen }) {
  if (!isOpen) return null;

  return (
    <aside style={{
      width: "220px", minWidth: "220px", background: "#0f0f0f", height: "calc(100vh - 56px)",
      position: "sticky", top: "56px", padding: "10px", display: "flex", flexDirection: "column", gap: "8px",
      borderRight: "1px solid #272727"
    }}>
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "10px 12px", borderRadius: "8px" }}>
        <Home size={20} /> Home
      </Link>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "10px 12px", color: "#aaa" }}>
        <Compass size={20} /> Explore
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "10px 12px", color: "#aaa" }}>
        <PlaySquare size={20} /> Subscriptions
      </div>
      <hr style={{ borderColor: "#272727", margin: "8px 0" }} />
      <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "10px 12px", color: "#aaa" }}>
        <Clock size={20} /> Watch Later
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "10px 12px", color: "#aaa" }}>
        <ThumbsUp size={20} /> Liked Videos
      </div>
    </aside>
  );
}