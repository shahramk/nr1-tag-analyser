import React from 'react';
import PropTypes from 'prop-types';

import { Button } from 'nr1';
import PdfGenerator from '../PdfGenerator';

export default class EntityHeader extends React.Component {
  state = {
    generatingPdf: false,
  }

  onGeneratePdf = () => this.setState({ generatingPdf: true });
  onPdfDownload = () => this.setState({ generatingPdf: false });

  render() {
    const { count, entityType, accounts, filter, entities } = this.props;
    const { generatingPdf } = this.state;

    return (
      <div className="entity__table__header__panel">
        <div className="entity__table__header__message">
          {`Showing ${count}${entityType !== 'None' ? ` ${entityType} ` : ''} 
          ${count > 1 ? 'entities' : 'entity'} 
          ${!accounts ? '' : `for account(s) ${accounts}`} `}
        </div>
        <div className="button__row">
          <Button
            onClick={() => filter('FULL')}
            type={Button.TYPE.PLAIN_NEUTRAL}
            iconType={Button.ICON_TYPE.INTERFACE__OPERATIONS__SHOW}
            sizeType={Button.SIZE_TYPE.SMALL}
          >
            All
          </Button>

          <Button
            onClick={() => filter('OUT_OF_COMPLIANCE')}
            type={Button.TYPE.PLAIN_NEUTRAL}
            iconType={Button.ICON_TYPE.INTERFACE__SIGN__TIMES__V_ALTERNATE}
            sizeType={Button.SIZE_TYPE.SMALL}
          >
            Out of Compliance
          </Button>

          <Button
            onClick={() => filter('IN_COMPLIANCE')}
            type={Button.TYPE.PLAIN_NEUTRAL}
            iconType={
              Button.ICON_TYPE.INTERFACE__SIGN__CHECKMARK__V_ALTERNATE
            }
            sizeType={Button.SIZE_TYPE.SMALL}
          >
            In Compliance
          </Button>
          {generatingPdf ? (
            <PdfGenerator
              data={entities}
              accounts={!accounts ? 'All Accounts' : accounts}
              filters={entityType}
              pdfComplete={this.onPdfDownload}
            />
          ) : (
            <Button
              onClick={() => this.onGeneratePdf()}
              type={Button.TYPE.PLAIN_NEUTRAL}
              iconType={Button.ICON_TYPE.DOCUMENTS__DOCUMENTS__NOTES}
              sizeType={Button.SIZE_TYPE.SMALL}
            >
              Generate pdf
            </Button>
          )}
        </div>
      </div>
    );
  }
}

EntityHeader.propTypes = {
  filter: PropTypes.func.isRequired,
  count: PropTypes.number.isRequired,
  accounts: PropTypes.string,
  entityType: PropTypes.string.isRequired,
  entities: PropTypes.array.isRequired,
};

// export default EntityHeader;
