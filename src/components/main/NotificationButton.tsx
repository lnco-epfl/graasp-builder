import { MentionButton } from '@graasp/chatbox';

import { hooks, mutations } from '../../config/queryClient';

export const NotificationButton = (): JSX.Element | null => {
  const { data: currentMember } = hooks.useCurrentMember();

  // mutations to handle the mentions
  const { mutate: patchMentionMutate } = mutations.usePatchMention();
  const { mutate: deleteMentionMutate } = mutations.useDeleteMention();
  const { mutate: clearAllMentionsMutate } = mutations.useClearMentions();

  if (!currentMember) {
    return null;
  }

  const memberId = currentMember?.id;

  const patchMentionFunction = ({
    id,
    status,
  }: {
    id: string;
    status: string;
  }) => patchMentionMutate({ memberId, id, status });
  const deleteMentionFunction = (mentionId: string) =>
    deleteMentionMutate(mentionId);
  const clearAllMentionsFunction = () => clearAllMentionsMutate();

  return (
    <MentionButton
      badgeColor="primary"
      useMentions={hooks.useMentions}
      patchMentionFunction={patchMentionFunction}
      deleteMentionFunction={deleteMentionFunction}
      clearAllMentionsFunction={clearAllMentionsFunction}
      color="inherit"
    />
  );
};

export default NotificationButton;
