import './Board.css';
import React from 'react';
import PropTypes from 'prop-types';

function Player(props) {
  const { user } = props;
  const { username } = props;
  const { score } = props;
  if (user === username) {
    return (
      <>
        <tr>
          <td className="currentUser">{username}</td>
          <td className="currentUser">{score}</td>
        </tr>
      </>
    );
  }
  return (
    <>
      <tr>
        <td className="leaderboard">{username}</td>
        <td className="leaderboard">{score}</td>
      </tr>
    </>
  );
}

Player.propTypes = {
  user: PropTypes.func.isRequired,
  username: PropTypes.func.isRequired,
  score: PropTypes.func.isRequired,
};

export default Player;
