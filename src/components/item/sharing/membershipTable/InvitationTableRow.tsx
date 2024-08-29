import { Chip, TableCell, TableRow, Typography } from '@mui/material';

import { DiscriminatedItem, Invitation, PermissionLevel } from '@graasp/sdk';

import { useBuilderTranslation, useEnumsTranslation } from '@/config/i18n';
import { mutations } from '@/config/queryClient';
import { BUILDER } from '@/langs/constants';

import EditPermissionModal from './EditPermissionModal';
import ResendInvitation from './ResendInvitation';
import TableRowDeleteButton from './TableRowDeleteButton';

const InvitationTableRow = ({
  data,
  item,
}: {
  item: DiscriminatedItem;
  data: Invitation;
}): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { t: translateEnums } = useEnumsTranslation();

  const { mutate: editInvitation } = mutations.usePatchInvitation();
  const { mutate: postInvitations } = mutations.usePostInvitations();
  const { mutate: deleteInvitation } = mutations.useDeleteInvitation();

  const changePermission = (permission: PermissionLevel) => {
    if (data.item.path === item.path) {
      editInvitation({
        id: data.id,
        permission,
        itemId: item.id,
      });
    } else {
      postInvitations({
        itemId: item.id,
        invitations: [
          {
            email: data.email,
            permission,
          },
        ],
      });
    }
  };

  return (
    <TableRow
      sx={{
        '&:last-child td, &:last-child th': { border: 0 },
      }}
    >
      <TableCell>
        <Typography noWrap fontWeight="bold">
          {data.name ?? '-'}
        </Typography>
        <Typography noWrap variant="subtitle2">
          {data.email}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Typography>{translateEnums(data.permission)}</Typography>
      </TableCell>
      <TableCell align="right">
        <Chip
          size="small"
          label={translateBuilder(BUILDER.INVITATION_NOT_REGISTER_TEXT)}
        />
      </TableCell>
      <TableCell align="right">
        <ResendInvitation invitationId={data.id} itemId={item.id} />
        <EditPermissionModal
          permission={data.permission}
          email={data.email}
          name={data.name}
          handleUpdate={changePermission}
          allowDowngrade={data.item.path === item.path}
        />
        <TableRowDeleteButton
          tooltip="reject"
          onClick={() => deleteInvitation({ id: data.id, itemId: item.id })}
        />
      </TableCell>
    </TableRow>
  );
};

export default InvitationTableRow;
