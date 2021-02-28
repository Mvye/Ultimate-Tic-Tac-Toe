import React from 'react';
import { ListJoined } from './ListJoined.js';
export function UsersList(props) {
    return (
        <div>
            <h3> Players: </h3>
            <ul> {props.players.map((player, index) => <ListJoined key={index} username={player}/>)} </ul>
            <h3> Spectators: </h3>
            <ul> {props.spectators.map((spectators, index) => <ListJoined key={index} username={spectators}/>)} </ul>
        </div>
    );
}