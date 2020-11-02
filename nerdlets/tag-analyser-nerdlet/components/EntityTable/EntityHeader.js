import React from 'react';
import PropTypes from 'prop-types';

import { Button, Icon, Select, SelectItem } from 'nr1';
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
      onChangePage,
      paginationInfo: {
        currentPage,
        totalPages,
        entityIndex: { startIdx, endIdx },
      },
    } = this.props;

    return (
      <>
        <div className="pagination-group">
          <div className="pagination-group-item pagination-message">
            {`${startIdx} to ${endIdx} of ${count}`}
          </div>
          <div
            className={`pagination-group-item pagination-nav ${
              !count || currentPage === 1 || totalPages <= 1
                ? 'disabled'
                : 'enabled'
            }`}
            onClick={() => onChangePage('first')}
          >
            <Icon type={Icon.TYPE.INTERFACE__CARET__CARET_LEFT__WEIGHT_BOLD} />
          </div>
          <div
            className={`pagination-group-item pagination-nav ${
              !count || currentPage === 1 ? 'disabled' : 'enabled'
            }`}
            onClick={() => onChangePage('back')}
          >
            <Icon type={Icon.TYPE.INTERFACE__CHEVRON__CHEVRON_LEFT__WEIGHT_BOLD} />
          </div>
          <div 
            className={`pagination-group-item pagination-nav ${
              !count || currentPage === totalPages ? 'disabled' : 'enabled'
            }`}
            onClick={() => onChangePage('forward')}>
            <Icon type={Icon.TYPE.INTERFACE__CHEVRON__CHEVRON_RIGHT__WEIGHT_BOLD} />
          </div>
          <div
            className={`pagination-group-item pagination-nav ${
              !count || currentPage === totalPages || totalPages <= 1
                ? 'disabled'
                : 'enabled'
            }`}
            onClick={() => onChangePage('last')}
          >
            <Icon type={Icon.TYPE.INTERFACE__CARET__CARET_RIGHT__WEIGHT_BOLD} />
          </div>
        </div>
      </>
    );
  }

  render() {
    const {
      count,
      entityType,
      accounts,
      filter,
      currentFilter,
      entities,
      complianceBands,
    } = this.props;
    const { generatingPdf } = this.state;

    return (
      <div className="entity__table__header__panel">
        <div className="message-group">
          <div className="message-group-item">
            <Select
              className="filter-group"
              value={currentFilter}
              onChange={filter}
            >
              <SelectItem value="FULL">All</SelectItem>
              <SelectItem value="OUT_OF_COMPLIANCE">Out of Compliance</SelectItem>
              <SelectItem value="IN_COMPLIANCE">In Compliance</SelectItem>
            </Select>
          </div>


          <div className="message-group-item">
            {`Showing ${count}${entityType !== 'None' ? ` ${entityType} ` : ''} 
            ${count > 1 || count === 0 ? 'entities' : 'entity'} 
            ${!accounts ? '' : `for account(s) ${accounts}`} `}
          </div>
        </div>
        <div className="action-group">
          <div className="action-group-item">{this.renderPageNavigation()}</div>

          <div className="action-group-item">
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
                  iconType={Button.ICON_TYPE.DOCUMENTS__DOCUMENTS__NOTES}
                  sizeType={Button.SIZE_TYPE.SMALL}
                >
                  Generate pdf
                </Button>
              )}
          </div>
        </div>
      </div>
    );
  }
}

EntityHeader.propTypes = {
  filter: PropTypes.func.isRequired,
  currentFilter: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  accounts: PropTypes.string,
  entityType: PropTypes.string.isRequired,
  complianceBands: PropTypes.object.isRequired,
  entities: PropTypes.array.isRequired,
  paginationInfo: PropTypes.object.isRequired,
  onChangePage: PropTypes.func.isRequired,
};
