import React from 'react';
import PropTypes from 'prop-types';

import { Button } from 'nr1';
import PdfGenerator from '../PdfGenerator';

const EntityHeader = ({ filter, count, accounts, entityType, entities }) => {
  return (
    <div className="entity__table__header__panel">
      <div className="entity__table__header__message">
        {`Showing ${count}${
          entityType !== 'None' ? ` ${entityType} ` : ''} 
          ${count > 1 ? 'entities' : 'entity'} 
          ${!accounts ? '' : `for account(s) ${accounts}`} `}
      </div>
      <div className="button__row">
        <Button
          onClick={() => filter('FULL')}
          type={Button.TYPE.NORMAL}
          iconType={Button.ICON_TYPE.INTERFACE__OPERATIONS__SHOW}
          sizeType={Button.SIZE_TYPE.SMALL}
        >
          All Entities
        </Button>

        <Button
          onClick={() => filter('OUT_OF_COMPLIANCE')}
          type={Button.TYPE.NORMAL}
          iconType={Button.ICON_TYPE.INTERFACE__OPERATIONS__HIDE_OTHERS}
          sizeType={Button.SIZE_TYPE.SMALL}
        >
          Out of Compliance
        </Button>

        <Button
          onClick={() => filter('IN_COMPLIANCE')}
          type={Button.TYPE.NORMAL}
          iconType={Button.ICON_TYPE.HARDWARE_AND_SOFTWARE__SOFTWARE__LIVE_VIEW}
          sizeType={Button.SIZE_TYPE.SMALL}
        >
          In Compliance
        </Button>
        <PdfGenerator
          data={entities}
          accounts={!accounts ? 'All Accounts' : accounts}
          filters={entityType}
        />
      </div>
    </div>
  );
};

EntityHeader.propTypes = {
  filter: PropTypes.func.isRequired,
  count: PropTypes.number.isRequired,
  accounts: PropTypes.string,
  entityType: PropTypes.string.isRequired,
  entities: PropTypes.array.isRequired,
};

export default EntityHeader;
