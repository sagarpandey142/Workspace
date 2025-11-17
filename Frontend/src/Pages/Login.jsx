
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api"; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(email, password);
      if (res.data.token) {
        navigate("/"); // redirect to dashboard
      } else {
        setError(res.error || "Login failed");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
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
        <h2 style={{ textAlign: "center" }}>Login</h2>
        {error && <div style={{ color: "red", textAlign: "center" }}>{error}</div>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: "8px", fontSize: "14px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: "8px", fontSize: "14px" }}
        />
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
          Login
        </button>
        <div style={{ textAlign: "center", fontSize: "12px" }}>
          Don't have an account? <a href="/signup">Signup</a>
        </div>
      </form>
    </div>
  );
}
