// Note: On Rebasing, lot of the imports are related to the tutorial link at the bottom, can be removed
import { useLocation, useNavigate } from 'react-router-dom';

import { Box, Stack } from '@mui/material';

import { AccountType } from '@graasp/sdk';
import { EpflLogo, MainMenu as GraaspMainMenu, MenuItem } from '@graasp/ui';

import { BookmarkIcon, HomeIcon, TrashIcon } from 'lucide-react';

import { hooks } from '@/config/queryClient';

import { useBuilderTranslation } from '../../config/i18n';
import {
  BOOKMARKED_ITEMS_PATH,
  HOME_PATH,
  RECYCLE_BIN_PATH,
} from '../../config/paths';
import { BUILDER } from '../../langs/constants';

const epflLogoBottom = <EpflLogo height={20} />;

const MainMenu = (): JSX.Element | null => {
  const { t } = useBuilderTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data: member } = hooks.useCurrentMember();

  const goTo = (path: string) => {
    navigate(path);
  };

  if (!member || !member.id) {
    return null;
  }

  const individualMenuItems =
    member.type === AccountType.Individual ? (
      <>
        <MenuItem
          dataUmamiEvent="sidebar-bookmarks"
          onClick={() => goTo(BOOKMARKED_ITEMS_PATH)}
          selected={pathname === BOOKMARKED_ITEMS_PATH}
          text={t(BUILDER.BOOKMARKED_ITEMS_TITLE)}
          icon={<BookmarkIcon />}
        />
        <MenuItem
          dataUmamiEvent="sidebar-trash"
          onClick={() => goTo(RECYCLE_BIN_PATH)}
          selected={pathname === RECYCLE_BIN_PATH}
          text={t(BUILDER.RECYCLE_BIN_TITLE)}
          icon={<TrashIcon />}
        />
      </>
    ) : null;

  return (
    <GraaspMainMenu fullHeight>
      <Stack direction="column" height="100%" justifyContent="space-between">
        <Box>
          <MenuItem
            dataUmamiEvent="sidebar-home"
            onClick={() => goTo(HOME_PATH)}
            selected={pathname === HOME_PATH}
            icon={<HomeIcon />}
            text={t(BUILDER.MY_ITEMS_TITLE)}
          />
          {individualMenuItems}
        </Box>
        <Stack alignItems="center" justifyContent="center">
          {epflLogoBottom}
        </Stack>
      </Stack>
    </GraaspMainMenu>
  );
};

export default MainMenu;
