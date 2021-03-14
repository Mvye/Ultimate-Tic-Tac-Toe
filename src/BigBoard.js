import './Board.css';
import React from 'react';
import { BigBox } from './BigBox.js'

export function BigBoard(props) {
    return (
        <div className="big-board">
            {props.board.map((item, index) => <BigBox key={index} click={props.click} board={props.board[index]} bigIndex={index}/>)}
        </div>
    );
}