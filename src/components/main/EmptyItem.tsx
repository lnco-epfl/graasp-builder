import Typography from '@mui/material/Typography';

import { FC } from 'react';

import { BUILDER } from '@graasp/translations';

import { useBuilderTranslation } from '../../config/i18n';
import { ITEMS_GRID_NO_ITEM_ID } from '../../config/selectors';

const EmptyItem: FC = () => {
  const { t: translateBuilder } = useBuilderTranslation();

  return (
    <Typography
      id={ITEMS_GRID_NO_ITEM_ID}
      variant="subtitle1"
      align="center"
      display="block"
    >
      {translateBuilder(BUILDER.EMPTY_ITEM_MESSAGE)}
    </Typography>
  );
};

export default EmptyItem;