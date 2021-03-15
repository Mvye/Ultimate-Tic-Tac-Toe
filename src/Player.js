import "./Board.css";
import React from "react";

export function Player(props) {
  if (props.user === props.username) {
    return (
      <React.Fragment>
        <tr>
          <td className="currentUser">{props.username}</td>
          <td className="currentUser">{props.score}</td>
        </tr>
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      <tr>
        <td className="leaderboard">{props.username}</td>
        <td className="leaderboard">{props.score}</td>
      </tr>
    </React.Fragment>
  );
}
