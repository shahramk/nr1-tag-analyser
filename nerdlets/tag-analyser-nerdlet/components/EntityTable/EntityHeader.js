import React from 'react';
import PropTypes from 'prop-types';

import { isEqual } from 'lodash';
import { Button, Spinner } from 'nr1';
import PdfGenerator from '../PdfGenerator';

export default class EntityHeader extends React.Component {
  state = {
    generatingPdf: false,
    rowsPerPage: 25, // move this to user storage - allow 25, 50, 100 per page
    currentPage: 1,
    totalPages: 0,
    entityIndex: {},
  }

  componentDidMount = () => {
    this.setState({
      totalPages: this.getTotalPages(),
      entityIndex: this.getEntityIndex(1)
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    // check for changes
    // config: entityTypes, templates, complianceBands
    // props: count, accounts, entityType(complianceScores, displayFilters)

    if (!isEqual(this.props, nextProps)) {
      console.log("@@@@ this.props: ", this.props, "\n@@@@ nextProps: ", nextProps);
      console.log(`>>>> EntityHeader.shouldComponentUpdate-> count: ${this.props.count} vs ${nextProps.count} -- currentPage: ${this.state.currentPage} vs ${nextState.currentPage} -- totalPages: ${this.state.totalPages} vs ${nextState.totalPages} --- entityIndex: ${this.state.entityIndex.startIdx} to ${this.state.entityIndex.endIdx} -- vs -- ${nextState.entityIndex.startIdx} to ${nextState.entityIndex.endIdx}`);

      if (
        this.props.count !== nextProps.count || 
        this.props.accounts !== nextProps.accounts || 
        this.props.entityType !== nextProps.entityType
      ) {
        this.resetValues(1);
      }
      return true
    }
    if (!isEqual(this.state, nextState)) {
      console.log("@@@@@@ this.state: ", this.state, "\n@@@@@@ nextState: ", nextState);
      // return true
    }
    return false
  }

  getTotalPages = () => {
    const { count } = this.props
    const { rowsPerPage } = this.state

    if (!count) {
      return 0;
    }
    else {
      const totalPages = count < rowsPerPage ? 1 : count / rowsPerPage

      console.log(">>>>>>>>>> EntityHeader.getTotalPages(): ", Math.ceil(totalPages));
      return Math.ceil(totalPages);
    }
  }

  getEntityIndex = (currentPage) => {
    const { rowsPerPage } = this.state;
    const { count } = this.props;

    const entityIndex = {
      startIdx: count ? (currentPage-1) * rowsPerPage + 1 : 0,
      endIdx: count ? currentPage * rowsPerPage > count ? count : currentPage * rowsPerPage : 0,
    }
    console.log(`>>>>>> EntityHeader.getEntityIndex-> count: ${count} -- currentPage: ${currentPage} -- totalPages: ${this.state.totalPages} entityIndex: ${entityIndex.startIdx} to ${entityIndex.endIdx}`);

    this.props.onChangePage(entityIndex);
    return entityIndex;
  }

  resetValues(pageNum) {
    // new entities array - set currentPage to 1, reset entityIndex start & end, totalPages
    this.setState({
      currentPage: pageNum,
      totalPages: this.getTotalPages(),
    }, () => {
      this.setState({
        entityIndex: this.getEntityIndex(pageNum),
      });
    });
    // console.log(`>> EntityHeader.resetToPage-> count: ${this.props.count} -- currentPage: ${this.state.currentPage} -- totalPages: ${this.state.totalPages} entityIndex: ${this.state.entityIndex.startIdx} to ${this.state.entityIndex.endIdx}`);

  }

  onPageBack = () => {
    let { currentPage } = this.state;
    this.setState({ currentPage: --currentPage }, () => {
      this.setState({ entityIndex: this.getEntityIndex(currentPage) });
    });
  }

  onPageForward = () => {
    let { currentPage } = this.state;
    this.setState({ currentPage: ++currentPage }, () => {
      this.setState({ entityIndex: this.getEntityIndex(currentPage) });
    });
  }

  renderPageNavigation = () => {
    const { count } = this.props;
    const { currentPage, totalPages, entityIndex } = this.state;

    return (
      <div style={{border: '1px solid black'}}>
        <Button
          onClick={() => this.onPageBack()}
          type={Button.TYPE.PLAIN_NEUTRAL}
          iconType={Button.ICON_TYPE.INTERFACE__CHEVRON__CHEVRON_LEFT__WEIGHT_BOLD}
          sizeType={Button.SIZE_TYPE.SMALL}
          disabled={currentPage === 1}
        />
        <Button
          type={Button.TYPE.PLAIN_NEUTRAL}
          sizeType={Button.SIZE_TYPE.SMALL}
          disabled={true}
        >
          {`${entityIndex.startIdx} to ${entityIndex.endIdx} of ${count}`}
          {/* {`Page ${currentPage} of ${totalPages}`} */}
        </Button>
        <Button
          onClick={() => this.onPageForward()}
          type={Button.TYPE.PLAIN_NEUTRAL}
          iconType={Button.ICON_TYPE.INTERFACE__CHEVRON__CHEVRON_RIGHT__WEIGHT_BOLD}
          sizeType={Button.SIZE_TYPE.SMALL}
          disabled={currentPage === totalPages}
        />
      </div>
    );
  }

  onGeneratePdf = () => this.setState({ generatingPdf: true });
  onPdfDownload = () => this.setState({ generatingPdf: false });

  render() {
    const { count, entityType, accounts, filter, entities, complianceBands } = this.props;
    const { generatingPdf, entityIndex } = this.state;

    const { currentPage, totalPages, } = this.state;
    console.log(`@@@>>>@@@ EntityHeader.render-> count: ${count} -- currentPage: ${currentPage} -- totalPages: ${totalPages} entityIndex: ${entityIndex.startIdx} to ${entityIndex.endIdx}`);

    return !count ? (
      <center><br/><h1>No Data</h1></center>
    ) : (
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
  onChangePage: PropTypes.func.isRequired,
};
