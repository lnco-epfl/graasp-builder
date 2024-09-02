import { useRef, useState } from 'react';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';

import { DiscriminatedItem } from '@graasp/sdk';

import useModalStatus from '@/components/hooks/useModalStatus';
import { SHARE_BUTTON_SELECTOR } from '@/config/selectors';

import ImportUsersWithCSVButton from '../csvImport/ImportUsersWithCSVButton';
import CreateItemMembershipForm from './CreateItemMembershipForm';

type Props = {
  item: DiscriminatedItem;
};

const ShareButton = ({ item }: Props): JSX.Element => {
  const [openMenu, setOpenMenu] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const {
    isOpen: isOpenImportCsvModal,
    closeModal: closeImportCsvModal,
    openModal: openImportCsvModal,
  } = useModalStatus();
  const {
    isOpen: isOpenShareItemModal,
    closeModal: closeShareItemModal,
    openModal: openShareItemModal,
  } = useModalStatus();

  const handleToggle = () => {
    setOpenMenu((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (anchorRef.current?.contains(event.target as HTMLElement)) {
      return;
    }

    setOpenMenu(false);
  };

  return (
    <>
      <ButtonGroup
        variant="contained"
        disableElevation
        ref={anchorRef}
        aria-label="sharing options"
      >
        <Button onClick={openShareItemModal} data-cy={SHARE_BUTTON_SELECTOR}>
          Share
        </Button>
        <Button
          size="small"
          aria-controls={openMenu ? 'split-button-menu' : undefined}
          aria-expanded={openMenu ? 'true' : undefined}
          aria-label="select share option"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{ zIndex: 1 }}
        open={openMenu}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        placement="bottom-start"
      >
        {({ TransitionProps }) => (
          // eslint-disable-next-line react/jsx-props-no-spreading
          <Grow {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  <MenuItem onClick={openShareItemModal}>Share</MenuItem>
                  <MenuItem onClick={() => openImportCsvModal()}>
                    Import with CSV
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
      <CreateItemMembershipForm
        open={isOpenShareItemModal}
        item={item}
        handleClose={closeShareItemModal}
      />
      <ImportUsersWithCSVButton
        item={item}
        handleCloseModal={closeImportCsvModal}
        open={isOpenImportCsvModal}
      />
    </>
  );
};

export default ShareButton;
