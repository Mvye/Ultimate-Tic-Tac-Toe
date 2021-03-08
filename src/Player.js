import './Board.css';
import React from 'react';

export function Player(props) {
    if (props.user === props.username) {
        return (
            <React.Fragment>
                <td className="currentUser">{props.username}</td>
                <td className="currentUser">{props.score}</td>
            </React.Fragment>
        );
    }
    return (
        <React.Fragment>
            <tr>
                <td>{props.username}</td>
                <td>{props.score}</td>
            </tr>
        </React.Fragment>
    );
}