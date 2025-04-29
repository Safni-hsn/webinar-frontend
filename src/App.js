import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import HostWebinar from "./Pages/HostWebinar";
import StudentWebinar from "./Pages/StudentWebinar";
import HostDashboard from "./Pages/Hostdashboard";
import StudentDashboard from "./Pages/StudentDashboard";

function App() {
  const [user, setUser] = useState(null); // Stores identity + role

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<LoginPage onLoginSuccess={setUser} />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/webinar/host"
          element={user?.role === "host" ? <HostWebinar identity={user.identity} /> : <Navigate to="/login" />}
        />
        <Route
  path="/host/dashboard"
  element={user?.role === "host" ? <HostDashboard identity={user.identity} /> : <Navigate to="/login" />}
/>
<Route
  path="/dashboard/student"
  element={user?.role === "student" ? <StudentDashboard identity={user.identity} /> : <Navigate to="/login" />}
/>

        <Route
          path="/webinar/student"
          element={user?.role === "student" ? <StudentWebinar identity={user.identity} /> : <Navigate to="/login" />}
        />
        
      </Routes>
    </Router>
  );
}

export default App;
