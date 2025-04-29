import React, { useEffect, useState } from "react";
import {
  LiveKitRoom,
  useTracks,
  ControlBar,
  ParticipantContext,
  TrackRefContext,
  DisconnectButton,
  TrackToggle,
  Chat,
  VideoTrack,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { useLocation } from "react-router-dom";
import "./StudentWebinar.css";

const StudentWebinar = ({ identity }) => {
  const [token, setToken] = useState(null);
  const location = useLocation();
  const roomId = location.state?.roomId || "fallback-room-id";

  useEffect(() => {
    fetch(`https://webinarbackend-c8fwh5bca9ajgmdw.centralindia-01.azurewebsites.net/api/token?identity=${identity}&room=${roomId}&isHost=false`)
      .then((res) => res.json())
      .then((data) => setToken(data.token))
      .catch((err) => console.error("❌ Token fetch failed:", err));
  }, [identity, roomId]);

  if (!token) return <div className="loading-screen">Joining webinar...</div>;

  return (
    <LiveKitRoom
      token={token}
      serverUrl="wss://webinar-n9djmx84.livekit.cloud"
      connect={true}
      video={false}
      audio={true}
      className="lk-room"
    >
      <StudentLayout />
    </LiveKitRoom>
  );
};

const StudentLayout = () => {
  const cameraTracks = useTracks([Track.Source.Camera]);
  const screenTracks = useTracks([Track.Source.ScreenShare]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const hostTrack = screenTracks[0] || cameraTracks[0];

  return (
    <div className="host-layout">
      <div className="main-host-view">
        {hostTrack ? (
          <TrackRefContext.Provider value={hostTrack}>
            <ParticipantContext.Provider value={hostTrack.participant}>
              <VideoTrack trackRef={hostTrack} width="100%" height="100%" style={{ borderRadius: '10px' }} />
            </ParticipantContext.Provider>
          </TrackRefContext.Provider>
        ) : (
          <p>Waiting for host to start stream...</p>
        )}
      </div>

      <div className="control-bar-wrapper">
        <ControlBar>
          <TrackToggle source="microphone" />
          <DisconnectButton />
        </ControlBar>
        <button
          className="custom-chat-button"
          onClick={() => setIsChatOpen(!isChatOpen)}
        >
          {isChatOpen ? "Close Chat" : "Open Chat"}
        </button>
      </div>

      {isChatOpen && (
        <div className="chat-popup">
          <Chat />
        </div>
      )}
    </div>
  );
};


export default StudentWebinar;
