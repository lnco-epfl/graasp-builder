import { ReactNode, SyntheticEvent, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

import { Badge, Box, Stack, Tab, Tabs, Typography } from '@mui/material';

import { OutletType } from '@/components/pages/item/type';

import { useBuilderTranslation } from '../../../../config/i18n';
import { hooks } from '../../../../config/queryClient';
import { BUILDER } from '../../../../langs/constants';
import ShareButton from '../shareButton/ShareButton';
import ItemMembershipsTable from './ItemMembershipsTable';
import MembershipRequestTable from './MembershipRequestTable';

type TabPanelProps = {
  children?: ReactNode;
  value: number;
  selectedTabId: number;
};
const CustomTabPanel = ({ children, value, selectedTabId }: TabPanelProps) => (
  <div
    role="tabpanel"
    hidden={value !== selectedTabId}
    id={`simple-tabpanel-${value}`}
    aria-labelledby={`simple-tab-${value}`}
  >
    <Box mt={1}>{children}</Box>
  </div>
);

const MembershipTabs = (): JSX.Element | null => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { item, canAdmin } = useOutletContext<OutletType>();
  const [selectedTabId, setSelectedTabId] = useState(0);

  const { data: requests } = hooks.useMembershipRequests(item.id);

  return (
    <Stack>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h6">
          {translateBuilder('Access Management')}
        </Typography>
        {canAdmin && <ShareButton item={item} />}
      </Stack>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={selectedTabId}
          onChange={(event: SyntheticEvent, newValue: number) => {
            setSelectedTabId(newValue);
          }}
          aria-label="memberships tabs"
        >
          <Tab label={translateBuilder(BUILDER.USER_MANAGEMENT_MEMBERS_TAB)} />
          {canAdmin && (
            <Tab
              label={
                requests?.length ? (
                  <Badge badgeContent={requests?.length} color="primary">
                    {translateBuilder(BUILDER.USER_MANAGEMENT_REQUESTS_TAB)}
                  </Badge>
                ) : (
                  translateBuilder(BUILDER.USER_MANAGEMENT_REQUESTS_TAB)
                )
              }
            />
          )}
        </Tabs>
      </Box>
      <CustomTabPanel selectedTabId={selectedTabId} value={0}>
        <ItemMembershipsTable />
      </CustomTabPanel>
      {canAdmin && (
        <CustomTabPanel selectedTabId={selectedTabId} value={1}>
          <MembershipRequestTable />
        </CustomTabPanel>
      )}
    </Stack>
  );
};

export default MembershipTabs;
