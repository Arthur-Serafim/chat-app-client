import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import "./Chat.css";
import ScrollToBottom from "react-scroll-to-bottom";
let socket;

export default function Chat({ location, history }) {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState([]);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const ENDPOINT = "localhost:5000";

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    socket = io(ENDPOINT);

    socket.on("users", users => {
      console.log(users);
      setUsers(users);
    });

    setName(name);
    setRoom(room);

    socket.emit("join", { name, room }, error => {
      if (error) {
        alert(error);
        history.push("/");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on("message", message => {
      setMessages([...messages, message]);
    });

    socket.on("users", users => {
      console.log(users);
      setUsers(users);
    });

    return () => {
      socket.emit("disconnect", name);

      socket.off();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  function sendMessage(e) {
    e.preventDefault();

    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
    console.log(message, messages);
  }

  return (
    <div className="chat-container">
      <div className="header-container">
        <span className="chat-title">{room} - </span>
        {users.map(user => {
          return <span className="online-users">| {user.name}</span>;
        })}
        <span className="online-users bar">|</span>
      </div>
      <ScrollToBottom className="chat-box-container">
        <ul className="chat-box">
          {messages.map(message => {
            if (message.user === "admin") {
              return (
                <div className="admin-container" key={message.text}>
                  <li className="admin-message list-item">{message.text}</li>
                </div>
              );
            } else {
              return (
                <li className="list-item" key={message.text}>
                  <span className="user-message">{message.user}</span>
                  {message.text}
                </li>
              );
            }
          })}
        </ul>
      </ScrollToBottom>
      <div className="input-container">
        <input
          type="text"
          onChange={e => setMessage(e.target.value)}
          onKeyPress={e => e.key === "Enter" && sendMessage(e)}
          value={message}
          placeholder="Type a message"
          className="chat-input"
        />
      </div>
    </div>
  );
}
