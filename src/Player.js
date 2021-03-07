import React from 'react';

export function Player(props) {
    return (
        <div>
            <td>{props.username}</td>
            <td>{props.score}</td>
        </div>
    );
}