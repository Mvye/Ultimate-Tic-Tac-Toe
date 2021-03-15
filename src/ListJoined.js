import React from "react";

export function ListJoined(props) {
  return (
    <React.Fragment>
      <tr>
        <td>{props.username}</td>
      </tr>
    </React.Fragment>
  );
}
