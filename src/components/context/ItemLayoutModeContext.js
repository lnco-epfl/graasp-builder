import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DEFAULT_ITEM_LAYOUT_MODE } from '../../config/constants';

const ItemLayoutModeContext = React.createContext();

const ItemLayoutModeProvider = ({ children }) => {
  const [mode, setMode] = useState(DEFAULT_ITEM_LAYOUT_MODE);

  return (
    <ItemLayoutModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ItemLayoutModeContext.Provider>
  );
};

ItemLayoutModeProvider.propTypes = {
  children: PropTypes.node,
};

ItemLayoutModeProvider.defaultProps = {
  children: null,
};

export { ItemLayoutModeProvider, ItemLayoutModeContext };