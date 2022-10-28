import PropTypes from 'prop-types';

import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { useIsParentInstance } from '../../../utils/item';

const TableRowDeleteButtonRenderer = ({
  item,
  buildIdFunction,
  tooltip,
  color,
  onDelete,
}) => {
  // todo: use typescript to precise data is one of Invitation or Membership
  const ChildComponent = ({ data }) => {
    const isFromParent = useIsParentInstance({
      instance: data,
      item,
    });

    const disabled = isFromParent;

    const onClick = () => {
      onDelete({ instance: data });
    };

    const renderButton = () => {
      const button = (
        <IconButton
          disabled={disabled}
          onClick={onClick}
          id={buildIdFunction(data.id)}
          color={color}
        >
          <CloseIcon />
        </IconButton>
      );

      if (!disabled || !tooltip) {
        return button;
      }

      return (
        <Tooltip title={tooltip}>
          <div>{button}</div>
        </Tooltip>
      );
    };

    return renderButton();
  };

  ChildComponent.propTypes = {
    data: PropTypes.shape({
      id: PropTypes.string.isRequired,
      itemPath: PropTypes.string.isRequired,
    }).isRequired,
  };
  return ChildComponent;
};

TableRowDeleteButtonRenderer.propTypes = {
  disabled: PropTypes.bool,
  tooltip: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  color: PropTypes.string,
};

TableRowDeleteButtonRenderer.defaultProps = {
  tooltip: null,
  color: 'default',
  disabled: false,
};

export default TableRowDeleteButtonRenderer;