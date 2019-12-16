import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
let socket;

export default function Chat({ location, history }) {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState([]);
  const [messages, setMessages] = useState([]);
  const ENDPOINT = "localhost:5000";

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    socket = io(ENDPOINT);

    setName(name);
    setRoom(room);

    socket.emit("join", { name, room }, error => {
      if (error) {
        alert(error);
        history.push("/");
      }
    });
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on("message", message => {
      setMessages([...messages, message]);
    });

    return () => {
      socket.emit("disconnect", name);

      socket.off();
    };
  }, [messages]);

  function sendMessage(e) {
    e.preventDefault();

    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
    console.log(message, messages);
  }

  return (
    <div>
      <div>
        <input
          type="text"
          onChange={e => setMessage(e.target.value)}
          onKeyPress={e => e.key === "Enter" && sendMessage(e)}
          value={message}
          id=""
        />
        <ul>
          {messages.map(message => (
            <li>
              {message.text} - {message.user}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
