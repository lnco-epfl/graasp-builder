import { Dialog } from '@mui/material';

import { DiscriminatedItem, ItemType } from '@graasp/sdk';

import ImportUsersDialogContent, {
  DIALOG_ID_LABEL,
} from './ImportUsersDialogContent';

type ImportUsersWithCSVButtonProps = {
  item: DiscriminatedItem;
  handleCloseModal: () => void;
  open: boolean;
};

const ImportUsersWithCSVButton = ({
  item,
  handleCloseModal,
  open,
}: ImportUsersWithCSVButtonProps): JSX.Element => (
  <Dialog
    scroll="paper"
    onClose={handleCloseModal}
    aria-labelledby={DIALOG_ID_LABEL}
    open={open}
  >
    <ImportUsersDialogContent
      item={item}
      isFolder={item.type === ItemType.FOLDER}
      handleClose={handleCloseModal}
    />
  </Dialog>
);
export default ImportUsersWithCSVButton;
