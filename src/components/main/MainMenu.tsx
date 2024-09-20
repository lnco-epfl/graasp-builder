import { useLocation, useNavigate } from 'react-router-dom';

// import { BugReport } from '@mui/icons-material';
import { Bookmark, Delete, Folder } from '@mui/icons-material';
import { Stack, styled } from '@mui/material';

import { EpflLogo, MainMenu as GraaspMainMenu, MenuItem } from '@graasp/ui';

import { hooks } from '@/config/queryClient';

import { useBuilderTranslation } from '../../config/i18n';
import {
  BOOKMARKED_ITEMS_PATH,
  HOME_PATH,
  RECYCLE_BIN_PATH,
} from '../../config/paths';
import { BUILDER } from '../../langs/constants';

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

const MainMenu = (): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data: member } = hooks.useCurrentMember();

  const goTo = (path: string) => {
    navigate(path);
  };

  // sentry feedback feature
  // const openBugReport = () => {
  //   const eventId = captureMessage(
  //     `Graasp Builder | User Feedback ${Date.now()}`,
  //   );
  //   // this will be reported in sentry user feedback issues
  //   showReportDialog({
  //     eventId,
  //     title: translateBuilder(BUILDER.REPORT_A_BUG),
  //     lang: i18n.language || DEFAULT_LANG,
  //   });
  // };

  // const reportBugLink = (
  //   <ListItem disablePadding>
  //     <ListItemButton onClick={openBugReport}>
  //       <ListItemIcon>
  //         <BugReport />
  //       </ListItemIcon>
  //       <ListItemText>{translateBuilder(BUILDER.REPORT_A_BUG)}</ListItemText>
  //     </ListItemButton>
  //   </ListItem>
  // );

  // const resourceLinks = (
  //   <ListItem disablePadding>
  //     <ListItemButton href={TUTORIALS_LINK} target="_blank">
  //       <ListItemIcon>
  //         <AutoStories />
  //       </ListItemIcon>
  //       <ListItemText>{translateBuilder(BUILDER.TUTORIALS)}</ListItemText>
  //     </ListItemButton>
  //   </ListItem>
  // );

  const epflLogoBottom = <EpflLogo height={20} />;

  const renderAuthenticatedMemberMenuItems = () => {
    if (!member || !member.id) {
      return (
        <StyledMenuItem
          disabled
          text={translateBuilder(BUILDER.HOME_TITLE)}
          icon={<Folder />}
        />
      );
    }

    return (
      <div>
        <MenuItem
          onClick={() => goTo(HOME_PATH)}
          selected={pathname === HOME_PATH}
          icon={<Folder />}
          text={translateBuilder(BUILDER.MY_ITEMS_TITLE)}
        />
        <MenuItem
          onClick={() => goTo(BOOKMARKED_ITEMS_PATH)}
          selected={pathname === BOOKMARKED_ITEMS_PATH}
          text={translateBuilder(BUILDER.BOOKMARKED_ITEMS_TITLE)}
          icon={<Bookmark />}
        />
        <MenuItem
          onClick={() => goTo(RECYCLE_BIN_PATH)}
          selected={pathname === RECYCLE_BIN_PATH}
          text={translateBuilder(BUILDER.RECYCLE_BIN_TITLE)}
          icon={<Delete />}
        />
      </div>
    );
  };

  return (
    <GraaspMainMenu fullHeight>
      <Stack direction="column" height="100%" justifyContent="space-between">
        {renderAuthenticatedMemberMenuItems()}
        <div style={{ margin: '0 auto' }}>
          {/* {reportBugLink} */}
          {epflLogoBottom}
        </div>
      </Stack>
    </GraaspMainMenu>
  );
};

export default MainMenu;
