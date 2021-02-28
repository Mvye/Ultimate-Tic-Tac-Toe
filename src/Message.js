import React from 'react';

export function Message(props) {
    if (props.end) {
        return (
            <p> {props.message} </p>
        );
    }
    const players = props.players;
    const nextPlayer = players[props.piece];
    return (
        <p> Next turn: {nextPlayer}({props.next})</p>
    );
}