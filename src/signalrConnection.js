import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
  .withUrl("http://localhost:5177/webinarhub")
  .withAutomaticReconnect()
  .build();

let started = false;

export async function startConnection() {
  if (!started && connection.state === "Disconnected") {
    await connection.start();
    started = true;
    console.log("✅ SignalR Connected");
  }
}

export default connection;
