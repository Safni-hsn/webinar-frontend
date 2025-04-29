import React, { useEffect, useState } from "react";
import connection from "../signalrConnection";

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [username] = useState("Student");

  useEffect(() => {
    const startConnection = async () => {
      try {
        await connection.start();
        console.log("✅ SignalR Connected");
      } catch (err) {
        console.error("❌ SignalR Connection Failed:", err);
      }
    };
  
    startConnection();
  
    connection.on("ReceiveMessage", (user, message) => {
      setMessages((prev) => [...prev, { user, message }]);
    });
  }, []);
  

  const sendMessage = async () => {
    if (connection.state !== "Connected") {
      console.warn("SignalR connection not ready yet!");
      return;
    }
  
    if (input.trim()) {
      try {
        await connection.invoke("SendMessage", username, input);
        setInput("");
      } catch (err) {
        console.error("Send failed:", err);
      }
    }
  };
  

  return (
    <div>
      <h3>Live Chat</h3>
      <div style={{ height: "200px", overflowY: "scroll", border: "1px solid gray", marginBottom: "10px" }}>
        {messages.map((msg, index) => (
          <p key={index}><strong>{msg.user}</strong>: {msg.message}</p>
        ))}
      </div>
      <input
        type="text"
        placeholder="Your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button 
  onClick={sendMessage} 
  disabled={connection.state !== "Connected"}
>
  Send
</button>

    </div>
  );
}

export default ChatBox;
