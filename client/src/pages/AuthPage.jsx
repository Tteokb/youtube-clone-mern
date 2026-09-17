import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api.js";
import { AuthContext } from "../context/AuthContext.jsx";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password || (!isLogin && !formData.username)) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      if (isLogin) {
        const res = await API.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });
        login(res.data.user, res.data.token);
        navigate("/");
      } else {
        await API.post("/auth/register", formData);
        setIsLogin(true);
        setError("Registration successful! Please log in.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
      <div style={{ background: "#212121", padding: "30px", borderRadius: "8px", width: "360px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>{isLogin ? "Sign In" : "Register"}</h2>
        {error && <p style={{ color: "#ff4e4e", marginBottom: "12px", fontSize: "14px" }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {!isLogin && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              style={{ padding: "10px", borderRadius: "4px", border: "1px solid #444", background: "#121212", color: "#fff" }}
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            style={{ padding: "10px", borderRadius: "4px", border: "1px solid #444", background: "#121212", color: "#fff" }}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={{ padding: "10px", borderRadius: "4px", border: "1px solid #444", background: "#121212", color: "#fff" }}
          />
          <button
            type="submit"
            style={{ padding: "10px", background: "#cc0000", color: "#fff", borderRadius: "4px", fontWeight: "bold" }}
          >
            {isLogin ? "Sign In" : "Register"}
          </button>
        </form>
        <p style={{ marginTop: "15px", fontSize: "14px", textAlign: "center", color: "#aaa" }}>
          {isLogin ? "Need an account? " : "Already registered? "}
          <span
            style={{ color: "#3ea6ff", cursor: "pointer" }}
            onClick={() => { setIsLogin(!isLogin); setError(""); }}
          >
            {isLogin ? "Create one" : "Sign In"}
          </span>
        </p>
      </div>
    </div>
  );
}