import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false); 
  const [error, setError] = useState("");
  const navigate = useNavigate();
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signup(name, email, password, isAdmin ? "admin" : "user"); 
      alert("Signup successful!");
      navigate("/login"); 
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Signup failed");
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          width: "300px",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Signup</h2>
        {error && <div style={{ color: "red", textAlign: "center" }}>{error}</div>}

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          style={{ padding: "8px", fontSize: "14px" }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ padding: "8px", fontSize: "14px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ padding: "8px", fontSize: "14px" }}
        />

        {/* Admin role checkbox */}
        <label style={{ fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={e => setIsAdmin(e.target.checked)}
          />
          Admin
        </label>

        <button
          type="submit"
          style={{
            padding: "10px",
            backgroundColor: "#2463EB",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Signup
        </button>

        <div style={{ textAlign: "center", fontSize: "12px" }}>
          Already have an account? <a href="/login">Login</a>
        </div>
      </form>
    </div>
  );
}
