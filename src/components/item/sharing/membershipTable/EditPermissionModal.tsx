import { useState } from 'react';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';

import { PermissionLevel } from '@graasp/sdk';
import { COMMON } from '@graasp/translations';
import { Button, EditButton } from '@graasp/ui';

import useModalStatus from '@/components/hooks/useModalStatus';

import {
  useBuilderTranslation,
  useCommonTranslation,
} from '../../../../config/i18n';
import { SHARE_ITEM_SHARE_BUTTON_ID } from '../../../../config/selectors';
import ItemMembershipSelect from '../ItemMembershipSelect';

type Props = {
  email?: string;
  name?: string;
  allowDowngrade?: boolean;
  permission: PermissionLevel;
  handleUpdate: (p: PermissionLevel) => void;
};

const EditPermissionModal = ({
  email,
  name,
  permission,
  allowDowngrade = true,
  handleUpdate,
}: Props): JSX.Element => {
  const { isOpen, openModal, closeModal } = useModalStatus();

  const [currentPermission, setCurrentPermission] = useState(permission);

  const { t: translateCommon } = useCommonTranslation();
  const { t: translateBuilder } = useBuilderTranslation();

  return (
    <>
      <EditButton
        onClick={() => {
          openModal();
        }}
      />
      <Dialog onClose={closeModal} open={isOpen}>
        <DialogTitle>
          Update <strong>{name || email}</strong> s permission
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1}>
            <Typography variant="body1">
              {translateBuilder(
                'Cannot downgrade permission if defined above.',
              )}
            </Typography>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              {name || email}
              <ItemMembershipSelect
                value={currentPermission}
                onChange={(e) => {
                  setCurrentPermission(e.target.value as PermissionLevel);
                }}
                size="medium"
                allowDowngrade={allowDowngrade}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={closeModal}>
            {translateCommon(COMMON.CANCEL_BUTTON)}
          </Button>
          <Button
            onClick={() => {
              handleUpdate(currentPermission);
              closeModal();
            }}
            id={SHARE_ITEM_SHARE_BUTTON_ID}
          >
            {translateBuilder('Update')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditPermissionModal;