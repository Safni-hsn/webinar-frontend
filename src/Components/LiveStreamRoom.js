import React from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";

const LiveStreamRoom = ({ token, identity, role }) => {
  const url = "ws://localhost:7880";

  return (
    <LiveKitRoom
      serverUrl={url}
      token={token}
      connect={true}
      video={true}
      audio={true}
    >
      <h3>Welcome, {identity} ({role})</h3>
      <VideoConference />
    </LiveKitRoom>
  );
};

export default LiveStreamRoom;
