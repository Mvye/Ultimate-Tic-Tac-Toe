import React from 'react';

export function Message(props) {
    if (props.end) {
        return (
            <p> {props.message} </p>
        );
    }
    return (
        <p> Next turn: { props.next }</p>
    );
}