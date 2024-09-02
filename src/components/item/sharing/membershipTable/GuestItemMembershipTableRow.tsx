import { TableCell, TableRow, Typography } from '@mui/material';

import { DiscriminatedItem, ItemMembership } from '@graasp/sdk';

import { useEnumsTranslation } from '@/config/i18n';

import { buildItemMembershipRowId } from '../../../../config/selectors';
import DeleteItemMembershipButton from './DeleteItemMembershipButton';

const GuestItemMembershipTableRow = ({
  data,
  itemId,
}: {
  data: ItemMembership;
  itemId: DiscriminatedItem['id'];
}): JSX.Element => {
  const { t: translateEnums } = useEnumsTranslation();

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
      </TableCell>
      <TableCell align="right">
        <Typography>{translateEnums(data.permission)}</Typography>
      </TableCell>
      <TableCell align="right">
        <DeleteItemMembershipButton itemId={itemId} data={data} />
      </TableCell>
    </TableRow>
  );
};

export default GuestItemMembershipTableRow;
