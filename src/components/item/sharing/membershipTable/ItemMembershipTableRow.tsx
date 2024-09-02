import { TableCell, TableRow, Typography } from '@mui/material';

import {
  AccountType,
  DiscriminatedItem,
  ItemMembership,
  PermissionLevel,
} from '@graasp/sdk';

import { useEnumsTranslation } from '@/config/i18n';
import { mutations } from '@/config/queryClient';

import { buildItemMembershipRowId } from '../../../../config/selectors';
import DeleteItemMembershipButton from './DeleteItemMembershipButton';
import EditPermissionButton from './EditPermissionButton';

const ItemMembershipTableRow = ({
  allowDowngrade = false,
  disabled,
  item,
  data,
}: {
  data: ItemMembership;
  item: DiscriminatedItem;
  allowDowngrade?: boolean;
  disabled: boolean;
}): JSX.Element => {
  const { t: translateEnums } = useEnumsTranslation();

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
      <TableCell>
        <Typography noWrap fontWeight="bold">
          {data.account.name}
        </Typography>
        <Typography noWrap variant="subtitle2">
          {data.account.type === AccountType.Individual && data.account.email}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Typography>{translateEnums(data.permission)}</Typography>
      </TableCell>
      <TableCell align="right">
        {!disabled && (
          <>
            <EditPermissionButton
              name={data.account.name}
              handleUpdate={changePermission}
              allowDowngrade={allowDowngrade}
              permission={data.permission}
            />
            <DeleteItemMembershipButton itemId={item.id} data={data} />
          </>
        )}
      </TableCell>
    </TableRow>
  );
};

export default ItemMembershipTableRow;
