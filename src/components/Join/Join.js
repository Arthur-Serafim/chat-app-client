import React, { useState } from "react";
import "./Join.css";

export default function Join(props) {
  const [info, setInfo] = useState({
    name: "",
    room: ""
  });

  function handleChange(e) {
    setInfo({
      ...info,
      [e.target.name]: e.target.value
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (info.name && info.room) {
      props.history.push(`/chat?name=${info.name}&room=${info.room}`);
    }
  }

  return (
    <div className="join-container">
      <h1 className="join-title">Join</h1>
      <form className="join-form" onSubmit={e => handleSubmit(e)}>
        <input
          type="text"
          placeholder="Name"
          className="join-input"
          name="name"
          value={info.name}
          onChange={e => handleChange(e)}
          required
        />
        <input
          type="text"
          placeholder="Room"
          className="join-input"
          name="room"
          value={info.room}
          onChange={e => handleChange(e)}
          required
        />
        <button type="submit" className="join-submit">
          Enter room
        </button>
      </form>
    </div>
  );
}
