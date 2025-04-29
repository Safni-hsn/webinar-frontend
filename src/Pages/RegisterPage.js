import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    const res = await fetch("http://localhost:5177/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      alert("✅ Registered successfully. Please log in.");
      navigate("/login"); // 🔁 redirect to login page
    } else {
      const error = await res.text();
      alert("❌ Registration failed: " + error);
    }
  };

  return (
    <div className="register-page">
      <h2>Student Registration</h2>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleRegister}>Register</button>

      <p>
        Already have an account?{" "}
        <span onClick={() => navigate("/login")} className="login-link">
          Login here
        </span>
      </p>
    </div>
  );
};

export default RegisterPage;
