import './Board.css';
import React from 'react';
import PropTypes from 'prop-types';
import Square from './Square';

function Board(props) {
  const { board } = props;
  const { click } = props;
  const { bigIndex } = props;
  return (
    <div className="small-board">
      {board.map((item, index) => (
        <Square
          key={index}
          index={index}
          click={() => {
            click(bigIndex, index);
          }}
          piece={props.board[index]}
        />
      ))}
    </div>
  );
}

Board.propTypes = {
  board: PropTypes.arrayOf(PropTypes.string).isRequired,
  click: PropTypes.func.isRequired,
  bigIndex: PropTypes.number.isRequired,
};

export default Board;
