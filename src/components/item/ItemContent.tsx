import { useOutletContext } from 'react-router-dom';

import { Container, Skeleton, Stack, styled } from '@mui/material';

import { Api } from '@graasp/query-client';
import {
  AccountType,
  AppItemType,
  Context,
  CurrentAccount,
  DocumentItemType,
  ItemType,
  LinkItemType,
  LocalFileItemType,
  PermissionLevel,
  S3FileItemType,
  buildPdfViewerLink,
  getLinkThumbnailUrl,
} from '@graasp/sdk';
import { DEFAULT_LANG } from '@graasp/translations';
import { AppItem, FileItem, LinkItem, Loader } from '@graasp/ui';
import { DocumentItem } from '@graasp/ui/text-editor';

import { API_HOST, GRAASP_ASSETS_URL } from '@/config/env';

import { ITEM_DEFAULT_HEIGHT } from '../../config/constants';
import { axios, hooks } from '../../config/queryClient';
import {
  DOCUMENT_ITEM_TEXT_EDITOR_ID,
  ITEM_SCREEN_ERROR_ALERT_ID,
  buildFileItemId,
} from '../../config/selectors';
import ErrorAlert from '../common/ErrorAlert';
import { OutletType } from '../pages/item/type';
import FolderContent from './FolderContent';
import FileAlignmentSetting from './settings/file/FileAlignmentSetting';
import FileMaxWidthSetting from './settings/file/FileMaxWidthSetting';
import { SettingVariant } from './settings/settingTypes';

const { useFileContentUrl } = hooks;

const StyledContainer = styled(Container)(() => ({
  flexGrow: 1,
}));

/**
 * Helper component to render typed file items
 */
const FileContent = ({
  item,
}: {
  item: LocalFileItemType | S3FileItemType;
}): JSX.Element | null => {
  const { data: fileUrl, isLoading, isError } = useFileContentUrl(item.id);

  if (fileUrl) {
    return (
      <StyledContainer>
        <Stack direction="column" alignItems="center" gap={2} width="100%">
          <Stack direction="row" gap={1}>
            <FileMaxWidthSetting item={item} variant={SettingVariant.Button} />
            <FileAlignmentSetting item={item} variant={SettingVariant.Button} />
          </Stack>
          <FileItem
            fileUrl={fileUrl}
            id={buildFileItemId(item.id)}
            item={item}
            pdfViewerLink={buildPdfViewerLink(GRAASP_ASSETS_URL)}
          />
        </Stack>
      </StyledContainer>
    );
  }

  if (isLoading) {
    return <Skeleton height="50vh" />;
  }

  if (isError) {
    return <ErrorAlert id={ITEM_SCREEN_ERROR_ALERT_ID} />;
  }

  return null;
};

/**
 * Helper component to render typed link items
 */
const LinkContent = ({
  item,
  member,
}: {
  item: LinkItemType;
  member?: CurrentAccount | null;
}): JSX.Element => (
  <LinkItem
    id={item.id}
    memberId={member?.id}
    isResizable
    item={item}
    thumbnail={getLinkThumbnailUrl(item.extra)}
    height={ITEM_DEFAULT_HEIGHT}
    showButton={Boolean(item.settings?.showLinkButton)}
    showIframe={Boolean(item.settings?.showLinkIframe)}
  />
);

/**
 * Helper component to render typed document items
 */
const DocumentContent = ({ item }: { item: DocumentItemType }): JSX.Element => (
  <StyledContainer>
    <DocumentItem id={DOCUMENT_ITEM_TEXT_EDITOR_ID} item={item} />
  </StyledContainer>
);

/**
 * Helper component to render typed app items
 */
const AppContent = ({
  item,
  member,
  permission = PermissionLevel.Read,
}: {
  item: AppItemType;
  member?: CurrentAccount | null;
  permission?: PermissionLevel;
}): JSX.Element => (
  <AppItem
    isResizable={false}
    item={item}
    height={ITEM_DEFAULT_HEIGHT}
    requestApiAccessToken={(payload: {
      id: string;
      key: string;
      origin: string;
    }) => Api.requestApiAccessToken(payload, { API_HOST, axios })}
    contextPayload={{
      apiHost: API_HOST,
      itemId: item.id,
      accountId: member?.id,
      permission,
      settings: item.settings,
      lang:
        item.settings?.lang ||
        (member?.type === AccountType.Individual && member?.extra?.lang) ||
        DEFAULT_LANG,
      context: Context.Builder,
    }}
  />
);

/**
 * Main item renderer component
 */
const ItemContent = (): JSX.Element => {
  const { data: member, isLoading, isError } = hooks.useCurrentMember();
  const { item, permission } = useOutletContext<OutletType>();

  if (isLoading) {
    return <Loader />;
  }

  if (!item || !item.id || isError) {
    return <ErrorAlert id={ITEM_SCREEN_ERROR_ALERT_ID} />;
  }

  switch (item.type) {
    case ItemType.LOCAL_FILE:
    case ItemType.S3_FILE: {
      return <FileContent item={item} />;
    }
    case ItemType.LINK:
      return <LinkContent item={item} member={member} />;
    case ItemType.DOCUMENT:
      return <DocumentContent item={item} />;
    case ItemType.APP:
      return <AppContent item={item} member={member} permission={permission} />;
    case ItemType.FOLDER:
      return <FolderContent item={item} />;
    default:
      return <ErrorAlert id={ITEM_SCREEN_ERROR_ALERT_ID} />;
  }
};

export default ItemContent;
