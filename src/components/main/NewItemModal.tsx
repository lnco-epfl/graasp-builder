import { useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  Typography,
  styled,
} from '@mui/material';

import {
  AppItemType,
  DiscriminatedItem,
  DocumentItemType,
  FolderItemType,
  ItemGeolocation,
  ItemType,
  LinkItemType,
} from '@graasp/sdk';
import { Button } from '@graasp/ui';

import { DOUBLE_CLICK_DELAY_MS } from '../../config/constants';
import { useBuilderTranslation } from '../../config/i18n';
import { mutations } from '../../config/queryClient';
import { ITEM_FORM_CONFIRM_BUTTON_ID } from '../../config/selectors';
import { InternalItemType, NewItemTabType } from '../../config/types';
import { BUILDER } from '../../langs/constants';
import { isItemValid } from '../../utils/item';
import CancelButton from '../common/CancelButton';
import AppForm from '../item/form/app/AppForm';
import DocumentForm from '../item/form/document/DocumentForm';
import { UploadFileModalContent } from '../item/form/file/UploadFileModalContent';
import { FolderCreateForm } from '../item/form/folder/FolderCreateForm';
import { LinkForm } from '../item/form/link/LinkForm';
import ImportZip from './ImportZip';
import ItemTypeTabs from './ItemTypeTabs';

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  flexGrow: 1,
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  paddingLeft: 0,
  paddingRight: 0,
}));

type PropertiesPerType = {
  [ItemType.FOLDER]: Partial<FolderItemType> & { thumbnail?: Blob };
  [ItemType.LINK]: Partial<LinkItemType>;
  [ItemType.APP]: Partial<AppItemType>;
  [ItemType.DOCUMENT]: Partial<DocumentItemType>;
};

type Props = {
  open: boolean;
  handleClose: () => void;
  geolocation?: Pick<ItemGeolocation, 'lat' | 'lng'>;
  previousItemId?: DiscriminatedItem['id'];
};

const DEFAULT_PROPERTIES: PropertiesPerType = {
  [ItemType.FOLDER]: { type: ItemType.FOLDER },
  [ItemType.LINK]: { type: ItemType.LINK, settings: { showLinkButton: false } },
  [ItemType.APP]: { type: ItemType.APP },
  [ItemType.DOCUMENT]: { type: ItemType.DOCUMENT },
};

const NewItemModal = ({
  open,
  handleClose,
  geolocation,
  previousItemId,
}: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const [isConfirmButtonDisabled, setConfirmButtonDisabled] = useState(false);
  const [selectedItemType, setSelectedItemType] = useState<NewItemTabType>(
    ItemType.FOLDER,
  );

  // todo: find a way to create this type of literal from the enum values instead of like this...
  const [updatedPropertiesPerType, setUpdatedPropertiesPerType] =
    useState<PropertiesPerType>(DEFAULT_PROPERTIES);

  const { mutate: postItem } = mutations.usePostItem();
  const { itemId: parentId } = useParams();

  const submitAndDisableConfirmButtonFor = (
    submitFn: () => void | boolean,
    durationMs: number,
  ) => {
    setConfirmButtonDisabled(true);
    submitFn();

    // schedule button disable state reset AFTER end of click event handling
    setTimeout(() => setConfirmButtonDisabled(false), durationMs);
    handleClose();

    setUpdatedPropertiesPerType(DEFAULT_PROPERTIES);
  };

  const submit = () => {
    if (isConfirmButtonDisabled) {
      console.error('confirm button is disabled');
      return false;
    }
    const type = selectedItemType as keyof PropertiesPerType;
    if (!isItemValid(updatedPropertiesPerType[type])) {
      console.error(
        'your item has invalid properties',
        updatedPropertiesPerType[type],
      );
      // todo: notify user
      return false;
    }
    // todo: fix types
    return submitAndDisableConfirmButtonFor(
      () =>
        postItem({
          geolocation,
          parentId,
          previousItemId,
          ...(updatedPropertiesPerType[type] as any),
        }),
      DOUBLE_CLICK_DELAY_MS,
    );
  };

  const updateItem = (
    item: Partial<DiscriminatedItem> & { thumbnail?: Blob },
  ) => {
    // update content given current type
    const type = selectedItemType as keyof PropertiesPerType;
    setUpdatedPropertiesPerType({
      ...updatedPropertiesPerType,
      [type]: {
        ...updatedPropertiesPerType[type],
        ...item,
      },
    });
  };

  // folders, apps, files, etherpad and links are handled beforehand
  const renderContent = () => {
    switch (selectedItemType) {
      case InternalItemType.ZIP:
        return (
          <>
            <Typography variant="h6" color="primary">
              {translateBuilder(BUILDER.IMPORT_ZIP_TITLE)}
            </Typography>
            <ImportZip />
          </>
        );
      case ItemType.DOCUMENT:
        return (
          <>
            <Typography variant="h6" color="primary">
              {translateBuilder(BUILDER.CREATE_NEW_ITEM_DOCUMENT_TITLE)}
            </Typography>
            <DocumentForm setChanges={updateItem} />
          </>
        );
      default:
        return null;
    }
  };

  // folders, etherpad and links are handled before
  const renderActions = () => {
    switch (selectedItemType) {
      case ItemType.DOCUMENT:
        return (
          <>
            <CancelButton onClick={handleClose} />
            <Button
              onClick={submit}
              id={ITEM_FORM_CONFIRM_BUTTON_ID}
              disabled={
                isConfirmButtonDisabled ||
                !isItemValid(updatedPropertiesPerType[selectedItemType])
              }
              type="submit"
            >
              {translateBuilder(BUILDER.CREATE_ITEM_ADD_BUTTON)}
            </Button>
          </>
        );
      case InternalItemType.ZIP:
      default:
        return null;
    }
  };

  // temporary solution to wrap content and actions
  const renderContentWithWrapper = () => {
    let content = null;
    switch (selectedItemType) {
      case ItemType.FOLDER: {
        content = (
          <FolderCreateForm
            onClose={handleClose}
            geolocation={geolocation}
            parentId={parentId}
            previousItemId={previousItemId}
          />
        );
        break;
      }
      case ItemType.LINK: {
        content = (
          <LinkForm
            onClose={handleClose}
            geolocation={geolocation}
            parentId={parentId}
            previousItemId={previousItemId}
          />
        );
        break;
      }
      case ItemType.APP: {
        content = (
          <AppForm
            onClose={handleClose}
            geolocation={geolocation}
            parentId={parentId}
            previousItemId={previousItemId}
          />
        );
        break;
      }
      case ItemType.S3_FILE:
      case ItemType.LOCAL_FILE: {
        content = (
          <UploadFileModalContent
            previousItemId={previousItemId}
            onClose={handleClose}
          />
        );
        break;
      }
      default: {
        content = renderContent();
      }
    }

    return (
      <>
        <StyledDialogContent>
          <Stack direction="column" px={2} width="100%" overflow="hidden">
            {content}
          </Stack>
        </StyledDialogContent>
        <DialogActions>{renderActions()}</DialogActions>
      </>
    );
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <Stack direction="row">
        <Stack>
          <ItemTypeTabs
            onTypeChange={setSelectedItemType}
            initialValue={selectedItemType}
          />
        </Stack>
        <Stack width="100%">{renderContentWithWrapper()}</Stack>
      </Stack>
    </Dialog>
  );
};

export default NewItemModal;
