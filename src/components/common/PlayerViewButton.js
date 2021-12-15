import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import { useTranslation } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import { redirect } from '../../utils/navigation';
import { buildGraaspPlayerView } from '../../config/paths';
import { buildPlayerButtonId } from '../../config/selectors';

const PlayerViewButton = ({ itemId }) => {
  const { t } = useTranslation();

  const onClick = () => {
    redirect(buildGraaspPlayerView(itemId), { openInNewTab: true });
  };

  return (
    <Tooltip title={t('Show Player View')}>
      <IconButton
        aria-label={t('player view')}
        onClick={onClick}
        id={buildPlayerButtonId(itemId)}
      >
        <PlayCircleFilledIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};

PlayerViewButton.propTypes = {
  itemId: PropTypes.string.isRequired,
};

export default PlayerViewButton;