import React, { useRef, useEffect, useState } from "react";
import connection from "../signalrConnection";

const VideoRoom = () => {
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const [, setPeerConnection] = useState(null);

  useEffect(() => {
    const setupWebRTC = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideoRef.current.srcObject = stream;

      const pc = new RTCPeerConnection();

      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });

      pc.onicecandidate = event => {
        if (event.candidate) {
          connection.invoke("SendIceCandidate", "student", event.candidate); // 👈 Replace "student" with real user ID later
        }
      };

      pc.ontrack = event => {
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      connection.on("ReceiveAnswer", (from, answer) => {
        pc.setRemoteDescription(new RTCSessionDescription(answer));
      });

      connection.on("ReceiveIceCandidate", (from, candidate) => {
        pc.addIceCandidate(new RTCIceCandidate(candidate));
      });

      if (connection.state === "Disconnected") {
        await connection.start();
      }
      

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await connection.invoke("SendOffer", "student", offer); // 👈 Replace "student" with real user ID later

      setPeerConnection(pc);
    };

    setupWebRTC();
  }, []);

  return (
    <div>
      <h3>Live Video Stream</h3>
      <video ref={localVideoRef} autoPlay muted playsInline width="300" />
      <video ref={remoteVideoRef} autoPlay playsInline width="300" />
    </div>
  );
};

export default VideoRoom;
