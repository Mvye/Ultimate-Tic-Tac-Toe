import './Board.css';
import React from 'react';
import { Square } from './Square.js'

export function Board(props) {
    return (
        <div className="small-board">
            {props.board.map((item, index) => <Square key={index} click={() => {props.click(props.bigIndex, index)}} piece={props.board[index]}/>)}
        </div>
    );
}