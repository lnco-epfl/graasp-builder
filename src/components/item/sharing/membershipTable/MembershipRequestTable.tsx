import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router';

import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import {
  CompleteMembershipRequest,
  PermissionLevel,
  formatDate,
} from '@graasp/sdk';
import { Button } from '@graasp/ui';

import { Check } from 'lucide-react';

import ErrorAlert from '@/components/common/ErrorAlert';
import { OutletType } from '@/components/pages/item/type';
import { useBuilderTranslation } from '@/config/i18n';
import { hooks, mutations } from '@/config/queryClient';
import { BUILDER } from '@/langs/constants';

import { buildItemMembershipRowId } from '../../../../config/selectors';

const MembershipRequestTable = (): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { i18n } = useTranslation();
  const { item, canAdmin } = useOutletContext<OutletType>();
  const { data: requests, isLoading } = hooks.useMembershipRequests(item.id, {
    enabled: canAdmin,
  });
  const { mutate: deleteRequest } = mutations.useDeleteMembershipRequest();
  const { mutate: shareItem } = mutations.usePostItemMembership();

  const acceptRequest = (data: CompleteMembershipRequest) => {
    shareItem({
      id: item.id,
      accountId: data.member.id,
      permission: PermissionLevel.Read,
    });
  };

  if (requests?.length) {
    return (
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>
                {translateBuilder(BUILDER.ITEM_MEMBERSHIPS_TABLE_MEMBER_HEADER)}
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">
                {translateBuilder(
                  BUILDER.MEMBERSHIPS_REQUEST_TABLE_CREATED_AT_HEADER,
                )}
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">
                {translateBuilder(
                  BUILDER.ITEM_MEMBERSHIPS_TABLE_ACTIONS_HEADER,
                )}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests?.map((r) => (
              <TableRow
                data-cy={buildItemMembershipRowId(r.member.id)}
                key={r.member.id}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                <TableCell>
                  <Typography noWrap fontWeight="bold">
                    {r.member.name}
                  </Typography>
                  <Typography noWrap variant="subtitle2">
                    {r.member.email}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography noWrap variant="subtitle2">
                    {formatDate(r.createdAt, { locale: i18n.language })}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Button
                    size="small"
                    color="success"
                    onClick={() => {
                      acceptRequest(r);
                    }}
                    endIcon={<Check size={20} />}
                  >
                    Accept
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    variant="text"
                    onClick={() =>
                      deleteRequest({ itemId: item.id, memberId: r.member.id })
                    }
                  >
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  if (requests?.length === 0) {
    return <Typography>No pending request.</Typography>;
  }

  if (isLoading) {
    return <Skeleton />;
  }

  return <ErrorAlert />;
};

export default MembershipRequestTable;
