import './Board.css';
import React from 'react';
import PropTypes from 'prop-types';
import BigBox from './BigBox';

function BigBoard(props) {
  const { bigBoard } = props;
  const { board } = props;
  const { boardClickable } = props;
  const { click } = props;
  const { isClickable } = props;
  return (
    <div className="big-board">
      {board.map((item, index) => (
        <BigBox
          key={index}
          bigBoardStatus={bigBoard[index]}
          bigIndex={index}
          board={board[index]}
          boardClickable={boardClickable}
          click={click}
          isClickable={isClickable}
        />
      ))}
    </div>
  );
}

BigBoard.propTypes = {
  bigBoard: PropTypes.arrayOf(PropTypes.string).isRequired,
  board: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  boardClickable: PropTypes.number.isRequired,
  click: PropTypes.func.isRequired,
  isClickable: PropTypes.bool.isRequired,
};

export default BigBoard;
