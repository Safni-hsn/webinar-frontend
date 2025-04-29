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
import "./HostWebinar.css";

const HostWebinar = ({ identity = "host1" }) => {
  const [token, setToken] = useState(null);
  const location = useLocation();
  const roomId = location.state?.roomId || "fallback-room-id";

  useEffect(() => {
    fetch(`http://localhost:5177/api/token?identity=${identity}&room=${roomId}&isHost=true`)
      .then((res) => res.json())
      .then((data) => setToken(data.token))
      .catch((err) => console.error("❌ Token fetch failed:", err));
  }, [identity, roomId]);

  if (!token) return <div className="loading-screen">⏳ Fetching token...</div>;

  return (
    <LiveKitRoom
      token={token}
      serverUrl="ws://localhost:7880"
      connect={true}
      video={true}
      audio={true}
      autoSubscribe={true}  
      className="lk-room"
    >
      <HostLayout />
    </LiveKitRoom>
  );
};

const HostLayout = () => {
  const tracks = useTracks([Track.Source.Camera, Track.Source.Microphone]);
  const hostTrack = tracks.find(t => t.participant.isLocal);
  const otherTracks = tracks.filter(t => !t.participant.isLocal);
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="host-layout">
      {/* Top participant strip */}
      <div className="top-participant-strip">
        {otherTracks.length > 0 ? (
          otherTracks.map((trackRef) => (
            <ParticipantContext.Provider key={trackRef.publication?.trackSid} value={trackRef.participant}>
              <TrackRefContext.Provider value={trackRef}>
                <div className="small-tile">
                  <VideoTrack trackRef={trackRef} width="100%" height="100%" style={{ borderRadius: '10px' }} />
                  <div className="small-name">{trackRef.participant.name}</div>
                </div>
              </TrackRefContext.Provider>
            </ParticipantContext.Provider>
          ))
        ) : (
          <p className="small-waiting-msg">Waiting for students...</p>
        )}
      </div>

      {/* Big host video */}
      <div className="main-host-view">
        {hostTrack ? (
          <VideoTrack trackRef={hostTrack} width="100%" height="100%" style={{ borderRadius: '10px' }} />
        ) : (
          <p>Loading host stream...</p>
        )}
      </div>

      {/* Control bar */}
      <div className="control-bar-wrapper">
        <ControlBar>
          <TrackToggle source="camera" />
          <TrackToggle source="microphone" />
          <TrackToggle source="screen_share" />
          <DisconnectButton />
        </ControlBar>

        {/* Custom Chat Toggle Button */}
        <button
          className="custom-chat-button"
          onClick={() => setIsChatOpen(!isChatOpen)}
        >
          {isChatOpen ? "Close Chat" : "Open Chat"}
        </button>
      </div>

      {/* Manual Chat Popup */}
      {isChatOpen && (
        <div className="chat-popup">
          <Chat />
        </div>
      )}
    </div>
  );
};



export default HostWebinar;
