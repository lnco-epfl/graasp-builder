import React from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { deleteItems } from '../../actions/item';
import { ITEM_DELETE_BUTTON_CLASS } from '../../config/selectors';

const DeleteButton = ({ itemIds, dispatchDeleteItems, color }) => {
  const { t } = useTranslation();

  return (
    <Tooltip title={t('Delete')}>
      <IconButton
        color={color}
        className={ITEM_DELETE_BUTTON_CLASS}
        aria-label="delete"
        onClick={() => dispatchDeleteItems(itemIds)}
      >
        <DeleteIcon />
      </IconButton>
    </Tooltip>
  );
};

DeleteButton.propTypes = {
  itemIds: PropTypes.string.isRequired,
  dispatchDeleteItems: PropTypes.func.isRequired,
  color: PropTypes.string,
};

DeleteButton.defaultProps = {
  color: '',
};

const mapDispatchToProps = {
  dispatchDeleteItems: deleteItems,
};

const ConnectedComponent = connect(null, mapDispatchToProps)(DeleteButton);

export default ConnectedComponent;
