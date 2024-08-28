import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { DiscriminatedItem, ItemMembership, isPseudoMember } from '@graasp/sdk';

import { useBuilderTranslation } from '@/config/i18n';
import { hooks, mutations } from '@/config/queryClient';
import { BUILDER } from '@/langs/constants';
import { selectHighestMemberships } from '@/utils/membership';

import ItemMembershipTableRow from './membershipTable/ItemMembershipTableRow';

type Props = { item: DiscriminatedItem };

const ItemLoginMembershipsTable = ({ item }: Props): JSX.Element | false => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { data: itemLoginSchema } = hooks.useItemLoginSchema({
    itemId: item.id,
  });
  const { data: memberships } = hooks.useItemMemberships(item?.id);
  const { mutate: deleteMembership } = mutations.useDeleteItemMembership();

  const onDelete = (im: ItemMembership) => {
    deleteMembership({ id: im.id, itemId: im.item.id });
  };

  if (itemLoginSchema && memberships) {
    const itemLoginMemberships = selectHighestMemberships(memberships)
      .filter((m) => isPseudoMember(m.account))
      .sort((im1, im2) => (im1.account.name > im2.account.name ? 1 : -1));

    //   show authenticated members if login schema is defined
    // todo: show only if item is pseudonymised
    return (
      <Box>
        <Typography variant="h6" m={0} p={0}>
          {translateBuilder(BUILDER.SHARING_AUTHENTICATED_MEMBERS_TITLE)}
        </Typography>

        {!itemLoginMemberships.length &&
          translateBuilder(BUILDER.SHARING_AUTHENTICATED_MEMBERS_EMPTY_MESSAGE)}

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>
                  {translateBuilder(BUILDER.ITEM_MEMBERSHIPS_TABLE_NAME_HEADER)}
                </TableCell>
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
              {itemLoginMemberships.map((row) => (
                <ItemMembershipTableRow
                  item={item}
                  data={row}
                  disabled={false}
                  onDelete={() => onDelete(row)}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }

  return false;
};

export default ItemLoginMembershipsTable;
