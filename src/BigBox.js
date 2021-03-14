import './Board.css';
import React from 'react';
import { Board } from './Board.js'

export function BigBox(props) {
    if (props.bigIndex === 1 || props.bigIndex === 7) {
        return (
            <div className="big-box middle-verticle">
                <Board click={props.click} board={props.board} bigIndex={props.bigIndex}/>
            </div>
        );
    }
    else if (props.bigIndex === 3 || props.bigIndex === 5) {
        return (
            <div className="big-box middle-horizontal">
                <Board click={props.click} board={props.board} bigIndex={props.bigIndex}/>
            </div>
        );
    }
    else if (props.bigIndex === 4) {
        return (
            <div className="big-box middle-verticle middle-horizontal">
                <Board click={props.click} board={props.board} bigIndex={props.bigIndex}/>
            </div>
        );
    }
    else {
        return (
            <div>
                <Board click={props.click} board={props.board} bigIndex={props.bigIndex}/>
            </div>
        );
    }
}