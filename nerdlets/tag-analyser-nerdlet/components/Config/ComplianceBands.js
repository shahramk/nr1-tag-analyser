import React from 'react';
import PropTypes from 'prop-types';

import helpers from '../../../shared/utils/helpers'

export default class ComplianceBands extends React.Component {
  static propTypes = {
    complianceBands: PropTypes.object,
    onUpdate: PropTypes.func,
  };

  state = {
    complianceBands: this.props.complianceBands || helpers.defaultComplianceBands,
  };

  deepCopy = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;

    const ret = Array.isArray(obj) ? [] : {};
    for (let key in obj) {
      const val = obj[key];
      ret[key] = this.deepCopy(val);
    }

    return ret;
  };

  onChange = (band, key, e) => {
    const { complianceBands } = this.state;
    const { onUpdate } = this.props;

    const newComplianceBands = this.deepCopy(complianceBands);
    newComplianceBands[band][key] = parseFloat(e.target.value);

    this.setState(
      {
        complianceBands: newComplianceBands,
      },
      () => (onUpdate ? onUpdate('complianceBands', newComplianceBands) : null)
    );
  };

  render() {
    const { complianceBands } = this.state;

    return (
      <div className="compliance-bands">
        <div className="message">Compliance bands are used to color-code compliance scores. High compliance bands will be colored green, middle yellow, and low red.</div>
        <div className="band">
          <div className="name high__band">High Band</div>
          <div className="vals">
            <span>&gt;=</span>
            <input
              type="number"
              className="u-unstyledInput"
              value={complianceBands.highBand.lowerLimit}
              onChange={e => this.onChange('highBand', 'lowerLimit', e)}
            />
          </div>
        </div>
        <div className="band">
          <div className="name mid__band">Medium Band</div>
          <div className="vals">
            <input
              type="number"
              className="u-unstyledInput"
              value={complianceBands.midBand.lowerLimit}
              onChange={e => this.onChange('midBand', 'lowerLimit', e)}
            />
            <span>to</span>
            <input
              type="number"
              className="u-unstyledInput"
              value={complianceBands.midBand.upperLimit}
              onChange={e => this.onChange('midBand', 'upperLimit', e)}
            />
          </div>
        </div>
        <div className="band">
          <div className="name low__band">Low Band</div>
          <div className="vals">
            <span>&lt;</span>
            <input
              type="number"
              className="u-unstyledInput"
              value={complianceBands.lowBand.upperLimit}
              onChange={e => this.onChange('lowBand', 'upperLimit', e)}
            />
          </div>
        </div>
      </div>
    );
  }
}
