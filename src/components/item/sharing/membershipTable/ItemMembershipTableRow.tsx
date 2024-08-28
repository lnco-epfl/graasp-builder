import { TableCell, TableRow, Typography } from '@mui/material';

import {
  AccountType,
  DiscriminatedItem,
  ItemMembership,
  PermissionLevel,
} from '@graasp/sdk';

import { useBuilderTranslation } from '@/config/i18n';
import { mutations } from '@/config/queryClient';

import {
  buildItemMembershipRowDeleteButtonId,
  buildItemMembershipRowId,
} from '../../../../config/selectors';
import { BUILDER } from '../../../../langs/constants';
import TableRowDeleteButton from '../TableRowDeleteButton';
import TableRowPermission from '../TableRowPermission';

const ItemMembershipTableRow = ({
  allowDowngrade = false,
  disabled,
  item,
  onDelete,
  data,
}: {
  data: ItemMembership;
  item: DiscriminatedItem;
  allowDowngrade?: boolean;
  disabled: boolean;
  onDelete: (data: ItemMembership) => void;
}): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const { mutate: editItemMembership } = mutations.useEditItemMembership();
  const { mutate: shareItem } = mutations.usePostItemMembership();

  const changePermission = (newPermission: PermissionLevel) => {
    if (data.item.path === item.path) {
      editItemMembership({
        id: data.id,
        permission: newPermission,
        itemId: item.id,
      });
    } else {
      shareItem({
        id: item.id,
        accountId: data.account.id,
        permission: newPermission,
      });
    }
  };

  return (
    <TableRow
      data-cy={buildItemMembershipRowId(data.id)}
      key={data.id}
      sx={{
        '&:last-child td, &:last-child th': { border: 0 },
      }}
    >
      <TableCell component="th" scope="data">
        <Typography noWrap>{data.account.name}</Typography>
        <Typography noWrap variant="subtitle2">
          {data.account.type === AccountType.Individual && data.account.email}
        </Typography>
      </TableCell>
      <TableCell align="right">
        {data.account.type === AccountType.Individual ? (
          <TableRowPermission
            permission={data.permission}
            changePermission={changePermission}
            allowDowngrade={allowDowngrade}
          />
        ) : (
          <Typography>{data.permission}</Typography>
        )}
      </TableCell>
      <TableCell align="right">
        <TableRowDeleteButton
          onClick={() => onDelete(data)}
          id={buildItemMembershipRowDeleteButtonId(data.id)}
          tooltip={translateBuilder(
            BUILDER.ITEM_MEMBERSHIPS_TABLE_CANNOT_DELETE_PARENT_TOOLTIP,
          )}
          disabled={disabled}
        />
      </TableCell>
    </TableRow>
  );
};

export default ItemMembershipTableRow;
