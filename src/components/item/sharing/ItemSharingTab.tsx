import { useOutletContext } from 'react-router-dom';

import { Box, Container, Stack, Typography } from '@mui/material';

import { AccountType } from '@graasp/sdk';

import { Loader } from 'lucide-react';

import ErrorAlert from '@/components/common/ErrorAlert';
import { OutletType } from '@/components/pages/item/type';
import { selectHighestMemberships } from '@/utils/membership';

import { useBuilderTranslation } from '../../../config/i18n';
import { hooks } from '../../../config/queryClient';
import { BUILDER } from '../../../langs/constants';
import CreateItemMembershipForm from './CreateItemMembershipForm';
import InvitationsTable from './InvitationsTable';
import VisibilitySelect from './VisibilitySelect';
import ImportUsersWithCSVButton from './csvImport/ImportUsersWithCSVButton';
import ItemMembershipsTable from './membershipTable/ItemMembershipsTable';
import ShortLinksRenderer from './shortLink/ShortLinksRenderer';

const MembershipSettings = (): JSX.Element | null => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { item, canWrite, canAdmin } = useOutletContext<OutletType>();

  const { data: rawMemberships, isLoading } = hooks.useItemMemberships(
    item?.id,
  );
  const { data: currentMember } = hooks.useCurrentMember();

  if (rawMemberships) {
    let memberships = rawMemberships;
    // can only edit your own membership
    if (!canWrite) {
      memberships = rawMemberships?.filter(
        (im) => im.account.id === currentMember?.id,
      );
    }

    memberships = selectHighestMemberships(memberships).sort((im1, im2) => {
      if (im1.account.type !== AccountType.Individual) {
        return 1;
      }
      if (im2.account.type !== AccountType.Individual) {
        return -1;
      }
      return im1.account.email > im2.account.email ? 1 : -1;
    });

    return (
      <Stack gap={2}>
        {canAdmin && (
          <>
            <CreateItemMembershipForm item={item} memberships={memberships} />
            <ImportUsersWithCSVButton item={item} />
          </>
        )}
        <Box>
          <Typography variant="h6">
            {translateBuilder(BUILDER.SHARING_AUTHORIZED_MEMBERS_TITLE)}
          </Typography>
          <ItemMembershipsTable
            item={item}
            memberships={memberships}
            readOnly={!canAdmin}
          />
        </Box>
        {canAdmin && (
          <Box>
            <Typography variant="h6">
              {translateBuilder(BUILDER.SHARING_INVITATIONS_TITLE)}
            </Typography>
            <InvitationsTable
              item={item}
              emptyMessage={translateBuilder(
                BUILDER.SHARING_INVITATIONS_EMPTY_MESSAGE,
              )}
              readOnly={!canAdmin}
            />
          </Box>
        )}
      </Stack>
    );
  }

  if (isLoading) {
    return <Loader />;
  }
  return <ErrorAlert />;
};

const ItemSharingTab = (): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { item, canAdmin } = useOutletContext<OutletType>();

  const { data: memberships } = hooks.useItemMemberships(item?.id);

  return (
    <Container disableGutters component="div">
      <Stack gap={2}>
        <Box>
          <Typography variant="h5">
            {translateBuilder(BUILDER.SHARING_TITLE)}
          </Typography>
          <ShortLinksRenderer
            itemId={item.id}
            canAdminShortLink={Boolean(memberships && canAdmin)}
          />
        </Box>
        <Box>
          <Typography variant="h6">
            {translateBuilder(BUILDER.ITEM_SETTINGS_VISIBILITY_TITLE)}
          </Typography>
          <VisibilitySelect item={item} edit={canAdmin} />
        </Box>
        <MembershipSettings />
      </Stack>
    </Container>
  );
};

export default ItemSharingTab;
