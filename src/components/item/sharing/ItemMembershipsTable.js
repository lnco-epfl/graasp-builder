import React from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TableContainer from '@material-ui/core/TableContainer';
import { useTranslation } from 'react-i18next';
import TableRow from '@material-ui/core/TableRow';
import { MUTATION_KEYS } from '@graasp/query-client';
import IconButton from '@material-ui/core/IconButton';
import { Loader } from '@graasp/ui';
import { hooks, useMutation } from '../../../config/queryClient';
import { PERMISSION_LEVELS } from '../../../enums';
import {
  buildItemMembershipRowDeleteButtonId,
  buildItemMembershipRowId,
} from '../../../config/selectors';
import ItemMembershipSelect from './ItemMembershipSelect';

const ItemMembershipRow = ({ membership, itemId }) => {
  const { data: user, isLoading } = hooks.useMember(membership.memberId);
  const { mutate: deleteItemMembership } = useMutation(
    MUTATION_KEYS.DELETE_ITEM_MEMBERSHIP,
  );
  const { mutate: editItemMembership } = useMutation(
    MUTATION_KEYS.EDIT_ITEM_MEMBERSHIP,
  );

  if (isLoading) {
    return <Loader />;
  }

  const deleteMembership = () => {
    deleteItemMembership({ itemId, id: membership.id });
  };

  const onChangePermission = (e) => {
    const { value } = e.target;
    editItemMembership({ itemId, id: membership.id, permission: value });
  };

  return (
    <TableRow
      hover
      role="checkbox"
      tabIndex={-1}
      key={membership.id}
      id={buildItemMembershipRowId(membership.id)}
    >
      <TableCell component="th" scope="row" padding="none">
        {user.get('name')}
      </TableCell>
      <TableCell component="th" scope="row" padding="none">
        {user.get('email')}
      </TableCell>
      <TableCell align="right">
        <ItemMembershipSelect
          value={membership.permission}
          showLabel={false}
          onChange={onChangePermission}
        />
      </TableCell>
      <TableCell align="right" padding="checkbox">
        <IconButton
          onClick={deleteMembership}
          id={buildItemMembershipRowDeleteButtonId(membership.id)}
        >
          <CloseIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

ItemMembershipRow.propTypes = {
  membership: PropTypes.shape({
    id: PropTypes.string.isRequired,
    permission: PropTypes.oneOf(Object.values(PERMISSION_LEVELS)).isRequired,
    memberId: PropTypes.string.isRequired,
  }).isRequired,
  itemId: PropTypes.string.isRequired,
};

const useStyles = makeStyles((theme) => ({
  emptyText: {
    margin: theme.spacing(2, 0),
  },
}));

// eslint-disable-next-line no-unused-vars
const ItemMembershipsTable = ({ memberships, id, emptyMessage }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const content = memberships.length ? (
    memberships.map((row) => <ItemMembershipRow membership={row} itemId={id} />)
  ) : (
    <Typography align="center" className={classes.emptyText}>
      {emptyMessage || t('No user has access to this item.')}
    </Typography>
  );

  return (
    <TableContainer>
      <Table size="small">
        <TableBody>{content}</TableBody>
      </Table>
    </TableContainer>
  );
};

ItemMembershipsTable.propTypes = {
  id: PropTypes.string.isRequired,
  memberships: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  emptyMessage: PropTypes.string,
};

ItemMembershipsTable.defaultProps = {
  emptyMessage: null,
};

export default ItemMembershipsTable;
