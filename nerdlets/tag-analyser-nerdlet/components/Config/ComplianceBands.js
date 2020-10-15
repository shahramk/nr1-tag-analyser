import React from 'react';
import PropTypes from 'prop-types';

export default class ComplianceBands extends React.Component {
  static propTypes = {
    complianceBands: PropTypes.object,
    onUpdate: PropTypes.func,
  };

  state = {
    // complianceBands: this.props.complianceBands || {
    //   highBand: { upperLimit: 100, lowerLimit: 90, color: 'seagreen' },
    //   midBand: { upperLimit: 90, lowerLimit: 70, color: 'sandybrown' },
    //   lowBand: { upperLimit: 70, lowerLimit: 0, color: 'orangered' },
    // },
    complianceBands: this.props.complianceBands,
  };

  deepCopy = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;

    let ret = Array.isArray(obj) ? [] : {};
    for (let key in obj) {
      const val = obj[key];
      ret[key] = this.deepCopy(val);
    }

    return ret;
  };

  onChange = (band, key, e) => {
    const { complianceBands } = this.state;
    const { onUpdate } = this.props;

    let newComplianceBands = this.deepCopy(complianceBands);
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
        <div className="band">
          <div className="name">High Band</div>
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
          <div className="name">Medium Band</div>
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
          <div className="name">Low Band</div>
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
