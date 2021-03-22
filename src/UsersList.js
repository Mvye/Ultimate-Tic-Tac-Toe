import React from 'react';
import PropTypes from 'prop-types';
import ListJoined from './ListJoined';

function UsersList(props) {
  const { players } = props;
  const { spectators } = props;
  return (
    <>
      <table>
        <tbody>
          <tr>
            <td className="user-headers"> Players: </td>
          </tr>
          {players.map((player, index) => (
            <ListJoined key={index} username={player} />
          ))}
          <tr>
            <td className="user-headers"> Spectators: </td>
          </tr>
          {spectators.map((spectator, index) => (
            <ListJoined key={index} username={spectators} />
          ))}
        </tbody>
      </table>
    </>
  );
}

UsersList.propTypes = {
  players: PropTypes.arrayOf(PropTypes.string).isRequired,
  spectators: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default UsersList;
