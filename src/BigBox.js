import './Board.css';
import React from 'react';
import PropTypes from 'prop-types';
import Board from './Board';
import bigBoxClassifier from './bigBoxClassifier';

function BigBox(props) {
  const { bigBoardStatus } = props;
  const { bigIndex } = props;
  const { board } = props;
  const { boardClickable } = props;
  const { click } = props;
  const className = bigBoxClassifier(bigBoardStatus, boardClickable, bigIndex);
  if (className === 'big-box') {
    return (
      <div>
        <Board click={click} board={board} bigIndex={bigIndex} />
      </div>
    );
  }
  return (
    <div className={className}>
      <Board click={click} board={board} bigIndex={bigIndex} />
    </div>
  );
}

BigBox.propTypes = {
  bigBoardStatus: PropTypes.string.isRequired,
  bigIndex: PropTypes.number.isRequired,
  board: PropTypes.arrayOf(PropTypes.string).isRequired,
  boardClickable: PropTypes.number.isRequired,
  click: PropTypes.func.isRequired,
};

export default BigBox;
