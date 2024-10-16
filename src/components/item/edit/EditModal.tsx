import { ComponentType as CT, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

import { routines } from '@graasp/query-client';
import { DiscriminatedItem, ItemType } from '@graasp/sdk';
import { COMMON, FAILURE_MESSAGES } from '@graasp/translations';

import isEqual from 'lodash.isequal';

import CancelButton from '@/components/common/CancelButton';
import { useBuilderTranslation, useCommonTranslation } from '@/config/i18n';
import notifier from '@/config/notifier';
import { mutations } from '@/config/queryClient';
import {
  EDIT_ITEM_MODAL_CANCEL_BUTTON_ID,
  EDIT_MODAL_ID,
  ITEM_FORM_CONFIRM_BUTTON_ID,
} from '@/config/selectors';
import { isItemValid } from '@/utils/item';

import { BUILDER } from '../../../langs/constants';
import BaseItemForm from '../form/BaseItemForm';
import DocumentForm from '../form/DocumentForm';
import FileForm from '../form/FileForm';
import NameForm from '../form/NameForm';

const { editItemRoutine } = routines;

export interface EditModalContentPropType {
  item?: DiscriminatedItem;
  setChanges: (payload: Partial<DiscriminatedItem>) => void;
  updatedProperties: Partial<DiscriminatedItem>;
}
export type EditModalContentType = CT<EditModalContentPropType>;

type Props = {
  item: DiscriminatedItem;
  onClose: () => void;
  open: boolean;
};

const EditModal = ({ item, onClose, open }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { t: translateCommon } = useCommonTranslation();

  const { mutate: editItem } = mutations.useEditItem();

  // updated properties are separated from the original item
  // so only necessary properties are sent when editing
  const [updatedItem, setUpdatedItem] = useState<DiscriminatedItem>(item);

  useEffect(() => {
    if (item.id !== updatedItem.id) {
      setUpdatedItem(item);
    }
  }, [item, updatedItem.id]);

  const ComponentType = ((): EditModalContentType => {
    switch (item.type) {
      case ItemType.DOCUMENT:
        return DocumentForm;
      case ItemType.LOCAL_FILE:
      case ItemType.S3_FILE:
        return FileForm;
      case ItemType.SHORTCUT:
        return NameForm;
      case ItemType.FOLDER:
      case ItemType.LINK:
      case ItemType.APP:
      default:
        return BaseItemForm;
    }
  })();

  const submit = () => {
    if (
      !isItemValid({
        ...item,
        ...updatedItem,
      } as DiscriminatedItem)
    ) {
      toast.error<string>(translateBuilder(BUILDER.EDIT_ITEM_ERROR_MESSAGE));
      return;
    }

    // add id to changed properties
    if (!item?.id) {
      notifier({
        type: editItemRoutine.FAILURE,
        payload: { error: new Error(FAILURE_MESSAGES.UNEXPECTED_ERROR) },
      });
    } else {
      editItem({
        id: updatedItem.id,
        name: updatedItem.name,
        displayName: updatedItem.displayName,
        description: updatedItem.description,
        // only post extra if it has been changed
        // todo: fix type
        extra: !isEqual(item.extra, updatedItem.extra)
          ? (updatedItem.extra as any)
          : undefined,
        // only patch settings it it has been changed
        ...(!isEqual(item.settings, updatedItem.settings)
          ? { settings: updatedItem.settings }
          : {}),
      });
    }

    onClose();
  };

  const setChanges = (payload: Partial<DiscriminatedItem>) => {
    setUpdatedItem({ ...updatedItem, ...payload } as DiscriminatedItem);
  };

  return (
    <Dialog
      onClose={onClose}
      id={EDIT_MODAL_ID}
      open={open}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id={item?.id}>
        {translateBuilder(BUILDER.EDIT_ITEM_MODAL_TITLE)}
      </DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <ComponentType
          updatedProperties={updatedItem}
          setChanges={setChanges}
          item={item}
        />
      </DialogContent>
      <DialogActions>
        <CancelButton id={EDIT_ITEM_MODAL_CANCEL_BUTTON_ID} onClick={onClose} />
        <Button
          // should not allow users to save if the item is not valid
          disabled={
            // // maybe we do not need the state variable and can just check the item
            // isConfirmButtonDisabled ||
            // isItem Valid checks a full item, so we add the updated properties to the item to check
            !isItemValid({
              ...item,
              ...updatedItem,
            })
          }
          onClick={submit}
          id={ITEM_FORM_CONFIRM_BUTTON_ID}
        >
          {translateCommon(COMMON.SAVE_BUTTON)}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default EditModal;
