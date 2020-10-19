import React from 'react';
import PropTypes from 'prop-types';
import { NerdletStateContext } from 'nr1';
import StackedConfiguration from "./stackedconfig"

export default class Wrapper extends React.Component {

  render() {
    return (
      <NerdletStateContext.Consumer>
        {nerdletUrlState => (
          <StackedConfiguration 
            nerdletUrlState={nerdletUrlState}
          />
        )}
      </NerdletStateContext.Consumer>
    )
  }
}  