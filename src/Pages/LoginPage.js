import "./LoginPage.css"; // 👈 Import your page-specific CSS
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const LoginPage = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirectPath, setRedirectPath] = useState(null);

  const handleLogin = async () => {
    const res = await fetch("https://webinarbackend-c8fwh5bca9ajgmdw.centralindia-01.azurewebsites.net/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const data = await res.json();
      onLoginSuccess(data);
      setRedirectPath(data.role === "host" ? "/host/dashboard" : "/dashboard/student");
    }
     else {
      alert("Login failed");
    }
  };

  useEffect(() => {
    if (redirectPath) navigate(redirectPath);
  }, [redirectPath, navigate]);

  return (
    <div className="login-page">
      <h2>Login</h2>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleLogin}>Login</button>
      <p>
        Not registered?{" "}
        <span onClick={() => navigate("/register")} className="register-link">
          Register as student
        </span>
      </p>
    </div>
  );
};

export default LoginPage;
