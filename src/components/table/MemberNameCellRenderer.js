import PropTypes from 'prop-types';

import { Typography } from '@mui/material';

const MemberNameCellRenderer = ({ users, defaultValue }) => {
  const ChildComponent = ({ data: item }) => {
    // users might contain null users
    const user = users?.find(({ id }) => id === item.creator);

    return <Typography noWrap>{user?.name ?? defaultValue}</Typography>;
  };
  ChildComponent.propTypes = {
    data: PropTypes.shape({
      creator: PropTypes.string.isRequired,
    }).isRequired,
  };
  return ChildComponent;
};

export default MemberNameCellRenderer;