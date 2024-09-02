import { useOutletContext } from 'react-router';

import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

import { AccountType, PermissionLevel } from '@graasp/sdk';

import groupby from 'lodash.groupby';

import ErrorAlert from '@/components/common/ErrorAlert';
import { OutletType } from '@/components/pages/item/type';
import { selectHighestMemberships } from '@/utils/membership';

import { useBuilderTranslation } from '../../../../config/i18n';
import { hooks } from '../../../../config/queryClient';
import { BUILDER } from '../../../../langs/constants';
import GuestItemMembershipTableRow from './GuestItemMembershipTableRow';
import InvitationTableRow from './InvitationTableRow';
import ItemMembershipTableRow from './ItemMembershipTableRow';

type Props = {
  showEmail?: boolean;
};

const EMPTY_NAME_VALUE = '-';

const ItemMembershipsTable = ({ showEmail = true }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const { data: currentMember } = hooks.useCurrentMember();
  const { item, canWrite, canAdmin } = useOutletContext<OutletType>();
  const { data: rawMemberships, isLoading: isMembershipsLoading } =
    hooks.useItemMemberships(item?.id);
  const { data: invitations, isLoading } = hooks.useItemInvitations(item.id, {
    enabled: canAdmin,
  });

  if (rawMemberships) {
    const hasOnlyOneAdmin =
      rawMemberships.filter((per) => per.permission === PermissionLevel.Admin)
        .length === 1;

    let memberships = rawMemberships;
    // can only edit your own membership
    if (!canWrite) {
      memberships = rawMemberships?.filter(
        (im) => im.account.id === currentMember?.id,
      );
    }

    // keep only the highest membership per member
    memberships = selectHighestMemberships(memberships).sort((im1, im2) => {
      if (im1.account.type !== AccountType.Individual) {
        return 1;
      }
      if (im2.account.type !== AccountType.Individual) {
        return -1;
      }
      return im1.account.name > im2.account.name ? 1 : -1;
    });

    // map memberships to corresponding row layout and meaningful data to sort
    const membershipsRows = memberships.map((im) => ({
      name: im.account.name,
      email:
        im.account.type === AccountType.Individual ? im.account.email : '-',
      permission: im.permission,
      component:
        im.account.type === AccountType.Individual ? (
          <ItemMembershipTableRow
            data={im}
            item={item}
            disabled={
              // cannot delete if not for current item
              im.item.path !== item.path ||
              // cannot delete if is the only admin
              (hasOnlyOneAdmin && im.permission === PermissionLevel.Admin)
            }
            allowDowngrade={
              // can downgrade for same item
              im.item.path === item.path &&
              // cannot downgrade your own membership
              im.account.id !== currentMember?.id
            }
          />
        ) : (
          <GuestItemMembershipTableRow itemId={item.id} data={im} />
        ),
    }));

    // map invitations to row layout and meaningful data to sort
    const invitationsRows =
      invitations?.map((r) => ({
        name: r.name ?? EMPTY_NAME_VALUE,
        email: r.email,
        permission: r.permission,
        component: <InvitationTableRow item={item} data={r} />,
      })) ?? [];

    // sort by name, email
    // empty names should be at the end
    // sorting by permission is done in the splitting below
    const sortFn = (
      d1: { name: string; email: string },
      d2: { name: string; email: string },
    ) => {
      if (d1.name === d2.name) {
        return d1.email > d2.email ? 1 : -1;
      }
      if (d1.name === EMPTY_NAME_VALUE) {
        return 1;
      }
      if (d2.name === EMPTY_NAME_VALUE) {
        return -1;
      }
      return d1.name > d2.name ? 1 : -1;
    };

    // split per permission to add divider between sections
    const rows = groupby(
      [...membershipsRows, ...invitationsRows],
      ({ permission }) => permission,
    );

    const adminRows = rows[PermissionLevel.Admin]?.toSorted(sortFn) ?? [];
    const writeRows = rows[PermissionLevel.Write]?.toSorted(sortFn) ?? [];
    const readRows = rows[PermissionLevel.Read]?.toSorted(sortFn) ?? [];

    if (rows) {
      return (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {showEmail && (
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    {translateBuilder(
                      BUILDER.ITEM_MEMBERSHIPS_TABLE_MEMBER_HEADER,
                    )}
                  </TableCell>
                )}
                <TableCell sx={{ fontWeight: 'bold' }} align="right">
                  {translateBuilder(
                    BUILDER.ITEM_MEMBERSHIPS_TABLE_PERMISSION_HEADER,
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
              {adminRows.map(({ component }) => component)}
              {Boolean(adminRows.length + writeRows.length) && (
                <TableCell colSpan={5} sx={{ padding: 0 }} />
              )}
              {writeRows.map(({ component }) => component)}
              {Boolean(readRows.length + writeRows.length) && (
                <TableCell colSpan={5} sx={{ padding: 0 }} />
              )}
              {readRows.map(({ component }) => component)}
            </TableBody>
          </Table>
        </TableContainer>
      );
    }
  }

  if (isMembershipsLoading || isLoading) {
    return <Skeleton />;
  }

  return <ErrorAlert />;
};

export default ItemMembershipsTable;
