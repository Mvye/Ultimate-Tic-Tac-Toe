import './Board.css';
import React from 'react';
import PropTypes from 'prop-types';
import Board from './Board';

function BigBox(props) {
  const { click } = props;
  const { board } = props;
  const { bigIndex } = props;
  if (bigIndex === 1 || bigIndex === 7) {
    return (
      <div className="big-box middle-verticle">
        <Board click={click} board={board} bigIndex={bigIndex} />
      </div>
    );
  }
  if (bigIndex === 3 || bigIndex === 5) {
    return (
      <div className="big-box middle-horizontal">
        <Board click={click} board={board} bigIndex={bigIndex} />
      </div>
    );
  }
  if (bigIndex === 4) {
    return (
      <div className="big-box middle-verticle middle-horizontal">
        <Board click={click} board={board} bigIndex={bigIndex} />
      </div>
    );
  }

  return (
    <div>
      <Board click={click} board={board} bigIndex={bigIndex} />
    </div>
  );
}

BigBox.propTypes = {
  board: PropTypes.arrayOf(PropTypes.string).isRequired,
  click: PropTypes.func.isRequired,
  bigIndex: PropTypes.number.isRequired,
};

export default BigBox;
