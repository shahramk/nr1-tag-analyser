/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';

import { PDFDownloadLink } from '@react-pdf/renderer';
import { PdfDocument } from './PdfDocument';

import { Button } from 'nr1';

export default class PdfGenerator extends React.Component {
  state = {
    pdfIsReady: false,
    preparing: false,
  };

  onGenerate = () => {
    this.setState({ pdfIsReady: true, preparing: true })
  }

  render() {
    const { pdfIsReady, preparing } = this.state;
    const { preparingPdf, pdfComplete } = this.props;
    const { data, complianceBands, accounts, filters } = this.props;
    
    //pdfIsReady ? 
    return (
      <PDFDownloadLink
        document={
          <PdfDocument
            data={data}
            accounts={accounts}
            complianceBands={complianceBands}
            filters={filters}
          />
        }
        fileName="nr_tags_report.pdf"
      >
        {({ blob, url, loading, error }) =>
          loading ? (
            <Button
              disabled
              type={Button.TYPE.PLAIN_NEUTRAL}
              iconType={Button.ICON_TYPE.DATE_AND_TIME__DATE_AND_TIME__TIME}
              sizeType={Button.SIZE_TYPE.SMALL}
              loading
            >
              Preparing
            </Button>
          ) : (
            <Button
              onClick={pdfComplete}
              type={Button.TYPE.PRIMARY}
              iconType={Button.ICON_TYPE.INTERFACE__OPERATIONS__DOWNLOAD}
              sizeType={Button.SIZE_TYPE.SMALL}
            >
              Download
            </Button>
          )
        }
      </PDFDownloadLink>
  )}
}

PdfGenerator.propTypes = {
  data: PropTypes.array.isRequired,
  accounts: PropTypes.string.isRequired,
  complianceBands: PropTypes.object.isRequired,
  filters: PropTypes.string.isRequired,
  pdfComplete: PropTypes.func.isRequired,
}
