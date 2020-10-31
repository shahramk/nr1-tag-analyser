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

  renderPageNavigation = () => {
    const {
      count,
      paginationInfo: {
        currentPage,
        totalPages,
        entityIndex: {
          startIdx,
          endIdx,
        }
      }
    } = this.props;

    return (
      <div style={{border: '1px solid black'}}>
        <Button
          onClick={() => this.props.onChangePage('first', count)}
          type={Button.TYPE.PLAIN_NEUTRAL}
          // iconType={Button.ICON_TYPE.INTERFACE__CHEVRON__CHEVRON_LEFT__WEIGHT_BOLD}
          iconType={Button.ICON_TYPE.INTERFACE__CARET__CARET_LEFT__WEIGHT_BOLD}
          sizeType={Button.SIZE_TYPE.SMALL}
          disabled={!count || currentPage === 1 || totalPages <= 1}
        />
        <Button
          onClick={() => this.props.onChangePage('back', count)}
          type={Button.TYPE.PLAIN_NEUTRAL}
          iconType={Button.ICON_TYPE.INTERFACE__CHEVRON__CHEVRON_LEFT__WEIGHT_BOLD}
          sizeType={Button.SIZE_TYPE.SMALL}
          disabled={!count || currentPage === 1}
        />

        <Button
          type={Button.TYPE.PLAIN_NEUTRAL}
          sizeType={Button.SIZE_TYPE.SMALL}
          disabled={true}
        >
          {count ? `Page ${currentPage} of ${totalPages} | ${startIdx} to ${endIdx} of ${count}` : '0 Entities'}
        </Button>
        
        <Button
          onClick={() => this.props.onChangePage('forward', count)}
          type={Button.TYPE.PLAIN_NEUTRAL}
          iconType={Button.ICON_TYPE.INTERFACE__CHEVRON__CHEVRON_RIGHT__WEIGHT_BOLD}
          sizeType={Button.SIZE_TYPE.SMALL}
          disabled={!count || currentPage === totalPages}
        />
        <Button
          onClick={() => this.props.onChangePage('last', count)}
          type={Button.TYPE.PLAIN_NEUTRAL}
          iconType={Button.ICON_TYPE.INTERFACE__CARET__CARET_RIGHT__WEIGHT_BOLD}
          sizeType={Button.SIZE_TYPE.SMALL}
          disabled={!count || currentPage === totalPages  || totalPages <= 1}
        />
      </div>
    );
  }

  render() {
    const { count, entityType, accounts, filter, entities, complianceBands } = this.props;
    const { generatingPdf } = this.state;

    return (
      <div className="entity__table__header__panel">
        <div className="entity__table__header__message">
          {`Showing ${count}${entityType !== 'None' ? ` ${entityType} ` : ''} 
          ${count > 1 || count === 0 ? 'entities' : 'entity'} 
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

          {this.renderPageNavigation()}

          {generatingPdf ? (
            <PdfGenerator
              data={entities}
              accounts={!accounts ? 'All Accounts' : accounts}
              filters={entityType}
              complianceBands={complianceBands}
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
  complianceBands: PropTypes.object.isRequired,
  entities: PropTypes.array.isRequired,
  paginationInfo: PropTypes.object.isRequired,
  onChangePage: PropTypes.func.isRequired,
};
