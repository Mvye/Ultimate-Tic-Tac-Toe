import './Board.css';
import React from 'react';
import PropTypes from 'prop-types';
import Player from './Player';

function Leaderboard(props) {
  const { leaderboard } = props;
  const { username } = props;
  return (
    <table>
      <thead>
        <tr>
          <th className="leaderboard" colSpan="2">
            Leaderboard
          </th>
        </tr>
      </thead>
      <tbody>
        {leaderboard.map((item, index) => (
          <Player
            key={index}
            user={username}
            username={leaderboard[index].username}
            score={leaderboard[index].score}
          />
        ))}
      </tbody>
    </table>
  );
}

Leaderboard.propTypes = {
  leaderboard: PropTypes.arrayOf(PropTypes.shape({
    score: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
  })).isRequired,
  username: PropTypes.string.isRequired,
};

export default Leaderboard;
