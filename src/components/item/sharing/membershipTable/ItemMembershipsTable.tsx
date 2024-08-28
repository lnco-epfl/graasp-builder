import { useState } from 'react';
import { useOutletContext } from 'react-router';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

import {
  AccountType,
  DiscriminatedItem,
  ItemMembership,
  PermissionLevel,
} from '@graasp/sdk';
import { Loader } from '@graasp/ui';

import ErrorAlert from '@/components/common/ErrorAlert';
import { OutletType } from '@/components/pages/item/type';

import { useBuilderTranslation } from '../../../../config/i18n';
import { hooks } from '../../../../config/queryClient';
import { BUILDER } from '../../../../langs/constants';
import DeleteItemMembershipDialog from '../DeleteItemMembershipDialog';
import ItemMembershipTableRow from './ItemMembershipTableRow';
import MembershipRequestTableRow from './MembershipRequestTableRow';

type Props = {
  item: DiscriminatedItem;
  memberships: ItemMembership[];
  showEmail?: boolean;
};

const ItemMembershipsTable = ({
  memberships,
  showEmail = true,
}: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const { data: currentMember } = hooks.useCurrentMember();
  const { item, canAdmin } = useOutletContext<OutletType>();
  const { data: requests, isLoading } = hooks.useMembershipRequests(item.id, {
    enabled: canAdmin,
  });

  const [open, setOpen] = useState(false);
  const [membershipToDelete, setMembershipToDelete] =
    useState<ItemMembership | null>(null);
  const onDelete = (im: ItemMembership) => {
    setMembershipToDelete(im);
    setOpen(true);
  };

  const hasOnlyOneAdmin =
    memberships.filter((per) => per.permission === PermissionLevel.Admin)
      .length === 1;

  const handleClose = () => {
    setOpen(false);
  };

  // this case should not happen!
  if (!memberships.length) {
    return <ErrorAlert />;
  }

  const membershipsRows = memberships
    .filter((im) => im.account.type === AccountType.Individual)
    .map((im) => ({
      value: (im.account as { email: string }).email,
      component: (
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
          onDelete={onDelete}
        />
      ),
    }));

  const requestsRows =
    requests?.map((r) => ({
      value: r.member.email,
      component: <MembershipRequestTableRow itemId={item.id} data={r} />,
    })) ?? [];

  let rows = [...membershipsRows, ...requestsRows].sort((d1, d2) =>
    d1.value > d2.value ? 1 : -1,
  );

  // add item login memberships at the end, sorted by name
  const itemLoginMembershipsRows = memberships
    .filter((im) => im.account.type === AccountType.Guest)
    .map((im) => ({
      value: im.account.name,
      component: (
        <ItemMembershipTableRow
          data={im}
          item={item}
          disabled={
            // cannot delete if not for current item
            im.item.path !== item.path
          }
          onDelete={onDelete}
        />
      ),
    }))
    .sort((d1, d2) => (d1.value < d2.value ? 1 : -1));

  rows = rows.concat(itemLoginMembershipsRows);

  if (isLoading) {
    return <Loader />;
  }

  if (rows) {
    return (
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {showEmail && (
                <TableCell sx={{ fontWeight: 'bold' }}>
                  {translateBuilder(
                    BUILDER.ITEM_MEMBERSHIPS_TABLE_EMAIL_HEADER,
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
          <TableBody>{rows.map(({ component }) => component)}</TableBody>
        </Table>
        {open && (
          <DeleteItemMembershipDialog
            open={open}
            handleClose={handleClose}
            itemId={item.id}
            membershipToDelete={membershipToDelete}
            hasOnlyOneAdmin={
              memberships.filter(
                (per) => per.permission === PermissionLevel.Admin,
              ).length === 1
            }
          />
        )}
      </TableContainer>
    );
  }

  return <ErrorAlert />;
};

export default ItemMembershipsTable;
