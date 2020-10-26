import React from 'react';
import PropTypes from 'prop-types';

import { Button } from 'nr1';
import { Dropdown } from 'semantic-ui-react';

const MenuBar = ({ accounts, selectedAccounts, openConfig, onAccountChange }) => {
  return (
    <div className="menu__container">
      <div className="menu__bar">
        <div className="menu__bar__dropdown-container">
          <div className="menu__bar__item">
            <div className="menu__bar__label">Accounts</div>
            <Dropdown
              className="menu__bar__semantic__dropdown"
              style={{ minWidth: '20rem' }}
              placeholder="Select Accounts"
              options={accounts}
              defaultValue={selectedAccounts}
              multiple
              search
              selection
              scrolling
              onChange={(event, data) => {
                onAccountChange(data);
              }}
            />
          </div>
        </div>
        <div className="menu__bar__item">
          <Button
            className="menu__bar__button"
            onClick={openConfig}
            type={Button.TYPE.PRIMARY}
            iconType={
              Button.ICON_TYPE
                .HARDWARE_AND_SOFTWARE__HARDWARE__SERVER__A_CONFIGURE
            }
            sizeType={Button.SIZE_TYPE.LARGE}
          >
            Setup
          </Button>
        </div>
      </div>
    </div>
  );
};

MenuBar.propTypes = {
  accounts: PropTypes.array.isRequired,
  selectedAccounts: PropTypes.array.isRequired,
  openConfig: PropTypes.func.isRequired,
  onAccountChange: PropTypes.func.isRequired,
};

export default MenuBar;
