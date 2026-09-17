import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, Video, UserCircle, LogOut } from "lucide-react";
import { AuthContext } from "../context/AuthContext.jsx";

export default function Header({ toggleSidebar, onSearch }) {
  const { user, logout } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchTerm);
  };

  return (
    <header style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "10px 20px", background: "#0f0f0f", position: "sticky", top: 0, zIndex: 100,
      borderBottom: "1px solid #272727"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <Menu onClick={toggleSidebar} style={{ cursor: "pointer" }} />
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "bold", fontSize: "18px" }}>
          <span style={{ color: "#ff0000", fontSize: "24px" }}>▶</span> YouTube
        </Link>
      </div>

      <form onSubmit={handleSearchSubmit} style={{ display: "flex", width: "40%", maxWidth: "600px" }}>
        <input
          type="text"
          placeholder="Search videos by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%", padding: "8px 12px", background: "#121212", border: "1px solid #303030",
            borderTopLeftRadius: "20px", borderBottomLeftRadius: "20px", color: "#fff"
          }}
        />
        <button
          type="submit"
          style={{
            padding: "8px 16px", background: "#222", border: "1px solid #303030",
            borderTopRightRadius: "20px", borderBottomRightRadius: "20px", color: "#fff"
          }}
        >
          <Search size={18} />
        </button>
      </form>

      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        {user ? (
          <>
            {user.channels && user.channels.length > 0 && (
              <Link to={`/channel/${user.channels[0]}`} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px" }}>
                <Video size={18} /> Channel
              </Link>
            )}
            <span style={{ fontWeight: "500", fontSize: "14px" }}>{user.username}</span>
            <button onClick={logout} title="Logout" style={{ background: "transparent", color: "#aaa" }}>
              <LogOut size={18} />
            </button>
          </>
        ) : (
          <Link
            to="/auth"
            style={{
              padding: "6px 14px", border: "1px solid #3ea6ff", borderRadius: "18px",
              color: "#3ea6ff", display: "flex", alignItems: "center", gap: "6px", fontSize: "14px"
            }}
          >
            <UserCircle size={18} /> Sign in
          </Link>
        )}
      </div>
    </header>
  );
}