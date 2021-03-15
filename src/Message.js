import React from "react";

export function Message(props) {
  if (props.end) {
    return (
      <div>
        <p> {props.message} </p>
        <button onClick={props.click}>Play Again? [{props.vote}/2]</button>
      </div>
    );
  }
  const players = props.players;
  const nextPlayer = players[props.player];
  return (
    <p>
      {" "}
      Next turn: {nextPlayer} ({props.next})
    </p>
  );
}
