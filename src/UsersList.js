import React from 'react';
import { ListJoined } from './ListJoined.js';
export function UsersList(props) {
    return (
        <div>
            <h4> Players: </h4>
            <ul> {props.players.map((player, index) => <ListJoined key={index} username={player}/>)} </ul>
            <h4> Spectators: </h4>
            <ul> {props.spectators.map((spectators, index) => <ListJoined key={index} username={spectators}/>)} </ul>
        </div>
    );
}