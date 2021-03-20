import React from 'react';
import PropTypes from 'prop-types';

function Message(props) {
  const { end } = props;
  const { message } = props;
  const { click } = props;
  const { vote } = props;
  if (end) {
    return (
      <div>
        <p>
          {' '}
          {message}
          {' '}
        </p>
        <button type="button" onClick={click}>
          Play Again? [
          {vote}
          /2]
        </button>
      </div>
    );
  }
  const { players } = props;
  const { player } = props;
  const nextPlayer = players[player];
  const { next } = props;
  return (
    <p>
      {' '}
      Next turn:
      {' '}
      {nextPlayer}
      {' '}
      (
      {next}
      )
    </p>
  );
}

Message.propTypes = {
  end: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  click: PropTypes.func.isRequired,
  vote: PropTypes.number.isRequired,
  players: PropTypes.arrayOf(PropTypes.string).isRequired,
  player: PropTypes.number.isRequired,
  next: PropTypes.string.isRequired,
};

export default Message;
