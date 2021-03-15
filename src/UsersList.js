import React from "react";
import { ListJoined } from "./ListJoined.js";
export function UsersList(props) {
  return (
    <React.Fragment>
      <table>
        <tbody>
          <tr>
            <td className="userHeaders"> Players: </td>
          </tr>
          {props.players.map((player, index) => (
            <ListJoined key={index} username={player} />
          ))}
          <tr>
            <td className="userHeaders"> Spectators: </td>
          </tr>
          {props.spectators.map((spectators, index) => (
            <ListJoined key={index} username={spectators} />
          ))}
        </tbody>
      </table>
    </React.Fragment>
  );
}
