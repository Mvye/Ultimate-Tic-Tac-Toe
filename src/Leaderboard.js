import React from 'react';
import { Player } from './Player.js'

export function Leaderboard(props) {
    return (
        <table>
        <thead>
            <tr>
                <th colspan="2">Leaderboard</th>
            </tr>
        </thead>
        <tbody>
            {props.leaderboard.map((item, index) => <Player key={index} username={props.leaderboard[index].username} score={props.leaderboard[index].score}/>)}
        </tbody>
        </table>
    );
}