import './Board.css';
import React from 'react';
import PropTypes from 'prop-types';

function Square(props) {
  const { index } = props;
  const { click } = props;
  const { piece } = props;
  return (
    <div key={index} className="box" onClick={click} aria-hidden="true">
      {' '}
      {piece}
      {' '}
    </div>
  );
}

Square.propTypes = {
  index: PropTypes.func.isRequired,
  click: PropTypes.func.isRequired,
  piece: PropTypes.func.isRequired,
};

export default Square;
