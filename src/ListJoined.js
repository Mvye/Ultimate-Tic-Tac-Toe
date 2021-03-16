import React from 'react';
import PropTypes from 'prop-types';

function ListJoined(props) {
  const { username } = props;
  return (
    <>
      <tr>
        <td>{username}</td>
      </tr>
    </>
  );
}

ListJoined.propTypes = {
  username: PropTypes.func.isRequired,
};

export default ListJoined;
