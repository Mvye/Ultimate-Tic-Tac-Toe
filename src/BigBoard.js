import './Board.css';
import React from 'react';
import PropTypes from 'prop-types';
import BigBox from './BigBox';

function BigBoard(props) {
  const { board } = props;
  const { click } = props;
  return (
    <div className="big-board">
      {board.map((item, index) => (
        <BigBox
          key={index}
          click={click}
          board={board[index]}
          bigIndex={index}
        />
      ))}
    </div>
  );
}

BigBoard.propTypes = {
  board: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  click: PropTypes.func.isRequired,
};

export default BigBoard;
