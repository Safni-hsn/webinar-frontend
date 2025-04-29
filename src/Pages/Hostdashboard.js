import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HostDashboard = () => {
  const [roomId, setRoomId] = useState("");
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  const generateRoomId = () => {
    const id = "webinar-" + Math.random().toString(36).substring(2, 8);
    setRoomId(id);
  };

  const startWebinar = async () => {
    if (!roomId) {
      alert("Please generate a webinar ID");
      return;
    }
  
    try {
      const res = await fetch(`http://localhost:5177/api/webinar/start?webinarId=${roomId}`, {
        method: "POST",
      });
  
      if (res.ok) {
        navigate("/webinar/host", { state: { roomId } });
      } else {
        alert("❌ Failed to start webinar");
      }
    } catch (err) {
      console.error("❌ Error starting webinar:", err);
    }
  };
  

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("http://localhost:5177/api/students");
        const data = await res.json();
        setStudents(data);
      } catch (err) {
        console.error("❌ Failed to fetch students:", err);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="host-dashboard">
      <h2>🎙️ Host Dashboard</h2>

      <button onClick={generateRoomId}>Generate Webinar ID</button>
      <input value={roomId} readOnly />
      <br />
      <button onClick={startWebinar} disabled={!roomId}>Start Webinar</button>

      <div className="student-list">
        <h3>📋 Registered Students</h3>
        <ul>
  {students.length > 0 ? (
    students.map((student, idx) => (
      <li key={idx}>{student.username}</li>  
    ))
  ) : (
    <li>Loading students...</li>
  )}
</ul>

      </div>
    </div>
  );
};

export default HostDashboard;
