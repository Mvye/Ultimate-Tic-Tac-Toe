import "./Board.css";
import React from "react";

export function Square(props) {
  return (
    <div key={props.index} className="box" onClick={props.click}>
      {" "}
      {props.piece}{" "}
    </div>
  );
}
