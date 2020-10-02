import React from 'react';

import { PDFDownloadLink } from "@react-pdf/renderer";
import { PdfDocument } from "./PdfDocument";

import { Button } from "nr1";


export default class PdfGenerator extends React.Component {

    state = {
        pdfIsReady: false,
        disableDownload: true,
    };

    toggle() {
        this.setState((prevState) => ({
          pdfIsReady: false
        }), () => {
            setTimeout(() => {
                this.setState({ pdfIsReady: true });
            }, 100);
        });
    }

    componentDidMount() {
        this.setState( { disableDownload: false })

    }

    render() {
        const { pdfIsReady, disableDownload } = this.state;
        const data = this.props;

        return (
            pdfIsReady ? (
            <PDFDownloadLink
                document={<PdfDocument data={data.data} accounts={data.accounts} filters={data.filters} />}
                fileName="document.pdf"
                style={{
                    textDecoration: "none",
                    padding: "10px",
                    color: "#4a4a4a",
                    backgroundColor: "#f2f2f2",
                    border: "1px solid #4a4a4a"
                }}
            >
                {({ blob, url, loading, error }) =>
                loading ? "Loading Document..." :
                <Button 
                disabled={disableDownload}
                onClick={() => (this.setState({ pdfIsReady: false }))}
                type={Button.TYPE.PRIMARY}
                iconType={Button.ICON_TYPE.INTERFACE__OPERATIONS__DOWNLOAD}
                sizeType={Button.SIZE_TYPE.SMALL}
                >
                Download
                </Button>
                }
            </PDFDownloadLink>
            ) : (
            <Button 
                disabled={disableDownload}
                onClick={() => this.toggle()}
                type={Button.TYPE.NORMAL}
                iconType={Button.ICON_TYPE.INTERFACE__OPERATIONS__DOWNLOAD}
                sizeType={Button.SIZE_TYPE.SMALL}
            >
                Prepare pdf
            </Button>
            )


        )
    }
}
