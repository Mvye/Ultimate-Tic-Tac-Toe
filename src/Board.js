import './Board.css';
import React from 'react';
import PropTypes from 'prop-types';
import Square from './Square';

function Board(props) {
  const { board } = props;
  const { click } = props;
  return (
    <div className="board">
      {board.map((item, index) => (
        <Square
          key={index}
          click={() => {
            click(index);
          }}
          piece={props.board[index]}
        />
      ))}
    </div>
  );
}

Board.propTypes = {
  board: PropTypes.func.isRequired,
  click: PropTypes.func.isRequired,
};

export default Board;
