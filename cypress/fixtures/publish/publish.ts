import {
  ItemTypeUnion,
  PackedAppItemFactory,
  PackedDocumentItemFactory,
  PackedFolderItemFactory,
  PackedLinkItemFactory,
  PackedLocalFileItemFactory,
  PackedS3FileItemFactory,
  PackedShortcutItemFactory,
} from '@graasp/sdk';

import { ItemForTest } from '../../support/types';

export const createPublicItemByType = (
  itemType: ItemTypeUnion,
): ItemForTest => {
  const publicTag = { publicTag: {} };

  switch (itemType) {
    case 'app':
      return PackedAppItemFactory({}, publicTag);
    case 'document':
      return PackedDocumentItemFactory({}, publicTag);
    case 'folder':
      return PackedFolderItemFactory({}, publicTag);
    case 'embeddedLink':
      return PackedLinkItemFactory({}, publicTag);
    case 'file':
      return PackedLocalFileItemFactory({}, publicTag);
    case 's3File':
      return PackedS3FileItemFactory({}, publicTag);
    case 'shortcut':
      return PackedShortcutItemFactory({}, publicTag);
    default:
      throw new Error(
        `Item Type "${itemType}" is unknown in "createPublicItemWithType"`,
      );
  }
};

export default createPublicItemByType;
