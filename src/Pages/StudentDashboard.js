import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const joinWebinar = async () => {
    if (!roomId.trim()) {
      setError("Please enter a Webinar ID.");
      return;
    }
  
    try {
      const res = await fetch(`http://localhost:5177/api/webinar/check/${roomId}`);
      const data = await res.json();
  
      if (data.exists) {
        // ✅ Webinar exists in DB
        navigate("/webinar/student", { state: { roomId } });
      } else {
        // ❌ Webinar does not exist
        setError("Invalid Webinar ID. Please check and try again.");
      }
    } catch (err) {
      console.error("❌ Failed to validate webinar ID:", err);
      setError("Server error. Please try again later.");
    }
  };
  

  return (
    <div className="student-dashboard">
      <h2>🎓 Student Dashboard</h2>

      <input
        type="text"
        placeholder="Enter Webinar ID"
        value={roomId}
        onChange={(e) => {
          setRoomId(e.target.value);
          setError(""); // Clear error on typing
        }}
      />
      <br />
      <button onClick={joinWebinar}>Join Webinar</button>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
};

export default StudentDashboard;
