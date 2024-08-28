import { IconButton, TableCell, TableRow, Typography } from '@mui/material';

import {
  DiscriminatedItem,
  PermissionLevel,
  SimpleMembershipRequest,
} from '@graasp/sdk';

import { Check } from 'lucide-react';

import { useBuilderTranslation } from '@/config/i18n';
import { mutations } from '@/config/queryClient';

import { buildItemMembershipRowId } from '../../../../config/selectors';
import TableRowDeleteButton from '../TableRowDeleteButton';

const MembershipRequestTableRow = ({
  data,
  itemId,
}: {
  itemId: DiscriminatedItem['id'];
  data: Pick<SimpleMembershipRequest, 'member'>;
}): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const { mutate: deleteRequest } = mutations.useDeleteMembershipRequest();
  const { mutate: shareItem } = mutations.usePostItemMembership();

  const acceptRequest = () => {
    shareItem({
      id: itemId,
      accountId: data.member.id,
      permission: PermissionLevel.Read,
    });
  };

  return (
    <TableRow
      data-cy={buildItemMembershipRowId(data.member.id)}
      key={data.member.id}
      sx={{
        '&:last-child td, &:last-child th': { border: 0 },
      }}
    >
      <TableCell component="th" scope="data">
        <Typography color="darkorange" noWrap>
          {data.member.name}
        </Typography>
        <Typography noWrap variant="subtitle2">
          {data.member.email}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Typography color="darkorange" sx={{ fontStyle: 'italic' }}>
          {translateBuilder('pending')}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <IconButton>
          <Check
            color="green"
            onClick={() => {
              acceptRequest();
            }}
          />
        </IconButton>
        <TableRowDeleteButton
          tooltip="reject"
          onClick={() => deleteRequest({ itemId, memberId: data.member.id })}
        />
      </TableCell>
    </TableRow>
  );
};

export default MembershipRequestTableRow;
