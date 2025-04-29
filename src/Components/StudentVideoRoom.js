import React, { useRef, useEffect, useState } from "react";
import connection from "../signalrConnection";

const StudentVideoRoom = () => {
  const remoteVideoRef = useRef();
  const [, setPeerConnection] = useState(null);

  useEffect(() => {
    const setupStudentConnection = async () => {
      const pc = new RTCPeerConnection();

      pc.ontrack = (event) => {
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          connection.invoke("SendIceCandidate", "host", event.candidate); // 👈 Replace with actual host ID
        }
      };

      connection.on("ReceiveOffer", async (from, offer) => {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        await connection.invoke("SendAnswer", from, answer);
      });

      connection.on("ReceiveIceCandidate", async (from, candidate) => {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.error("Error adding ICE candidate:", err);
        }
      });

      if (connection.state === "Disconnected") {
        await connection.start();
      }
      
      setPeerConnection(pc);
    };

    setupStudentConnection();
  }, []);

  return (
    <div>
      <h3>Student View</h3>
      <video ref={remoteVideoRef} autoPlay playsInline width="400" />
    </div>
  );
};

export default StudentVideoRoom;
