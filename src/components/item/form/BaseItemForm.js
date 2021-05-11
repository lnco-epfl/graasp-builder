import React from 'react';
import { makeStyles, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  ITEM_FORM_DESCRIPTION_INPUT_ID,
  ITEM_FORM_NAME_INPUT_ID,
} from '../../../config/selectors';
import { ITEM_TYPES } from '../../../config/constants';

const useStyles = makeStyles(() => ({
  shortInputField: {
    width: '50%',
  },
}));

const BaseForm = ({ onChange, item }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const handleNameInput = (event) => {
    onChange({ ...item, name: event.target.value });
  };

  const handleDescriptionInput = (event) => {
    onChange({ ...item, description: event.target.value });
  };

  return (
    <>
      <TextField
        autoFocus
        margin="dense"
        id={ITEM_FORM_NAME_INPUT_ID}
        label={t('Name')}
        value={item?.name}
        onChange={handleNameInput}
        className={classes.shortInputField}
      />
      <TextField
        id={ITEM_FORM_DESCRIPTION_INPUT_ID}
        margin="dense"
        label={t('Description')}
        value={item?.description}
        onChange={handleDescriptionInput}
        multiline
        rows={4}
        rowsMax={4}
        fullWidth
      />
    </>
  );
};

BaseForm.propTypes = {
  onChange: PropTypes.string.isRequired,
  item: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    extra: PropTypes.shape({
      [ITEM_TYPES.LINK]: PropTypes.shape({
        url: PropTypes.string,
      }),
    }),
  }).isRequired,
};

export default BaseForm;