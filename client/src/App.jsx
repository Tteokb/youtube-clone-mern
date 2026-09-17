import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Home from "./pages/Home.jsx";
import WatchPage from "./pages/WatchPage.jsx";
import ChannelPage from "./pages/ChannelPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleSearch = (query) => setSearchQuery(query);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header toggleSidebar={toggleSidebar} onSearch={handleSearch} />
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar isOpen={sidebarOpen} />
        <Routes>
          <Route path="/" element={<Home searchQuery={searchQuery} />} />
          <Route path="/watch/:id" element={<WatchPage />} />
          <Route path="/channel/:id" element={<ChannelPage />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </div>
    </div>
  );
}