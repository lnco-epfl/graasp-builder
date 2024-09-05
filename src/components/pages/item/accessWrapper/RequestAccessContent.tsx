import { LoadingButton } from '@mui/lab';
import { Stack, Typography } from '@mui/material';

import {
  CompleteMember,
  DiscriminatedItem,
  MembershipRequestStatus,
} from '@graasp/sdk';

import { Check, Lock } from 'lucide-react';

import { useBuilderTranslation } from '@/config/i18n';
import { hooks, mutations } from '@/config/queryClient';
import {
  MEMBERSHIP_REQUEST_PENDING_SCREEN_SELECTOR,
  REQUEST_MEMBERSHIP_BUTTON_ID,
} from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

type Props = {
  member: CompleteMember;
  itemId: DiscriminatedItem['id'];
};

const RequestAccessContent = ({ member, itemId }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const {
    mutateAsync: requestMembership,
    isSuccess,
    isLoading,
  } = mutations.useRequestMembership();
  const { data: request } = hooks.useOwnMembershipRequest(itemId);

  if (request?.status === MembershipRequestStatus.Pending) {
    return (
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        height="100%"
        gap={2}
        data-cy={MEMBERSHIP_REQUEST_PENDING_SCREEN_SELECTOR}
      >
        <Lock size={40} />
        <Typography variant="h3">
          {translateBuilder('You do not have access to this item')}
        </Typography>
        <Typography>
          {translateBuilder(
            'An admin needs to approve your request to access this item.',
          )}
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      height="100%"
      gap={2}
    >
      <Lock size={40} />
      <Typography variant="h3">
        {translateBuilder('Request access to this item')}
      </Typography>
      <LoadingButton
        id={REQUEST_MEMBERSHIP_BUTTON_ID}
        variant="contained"
        disabled={isSuccess}
        loading={isLoading}
        endIcon={isSuccess ? <Check /> : null}
        onClick={async () => {
          await requestMembership({ id: itemId });
        }}
      >
        {isSuccess
          ? translateBuilder('request sent')
          : translateBuilder('Request access')}
      </LoadingButton>
      <Typography variant="subtitle2">
        {translateBuilder(BUILDER.ITEM_LOGIN_HELPER_SIGN_OUT, {
          email: member.email,
        })}
      </Typography>
    </Stack>
  );
};

export default RequestAccessContent;
