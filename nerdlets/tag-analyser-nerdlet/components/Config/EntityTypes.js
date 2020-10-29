import React from 'react';
import PropTypes from 'prop-types';

import { Checkbox } from 'nr1';

export default class EntityTypes extends React.Component {
  static propTypes = {
    entityTypes: PropTypes.arrayOf(PropTypes.string),
    onUpdate: PropTypes.func,
  };

  state = {};

  onChange = (type) => {
    const { entityTypes, onUpdate } = this.props;

    let newEntityTypes = [...entityTypes];
    const foundTypeAt = newEntityTypes.findIndex(t => t === type);
    if (foundTypeAt > -1) {
      newEntityTypes.splice(foundTypeAt, 1);
    } else {
      newEntityTypes.push(type);
    }

    if (onUpdate) onUpdate('entityTypes', newEntityTypes);
  };

  render() {
    const { entityTypes } = this.props;

    const types = ['APM', 'MOBILE', 'BROWSER', 'INFRA', 'SYNTH'];

    return (
      <>
      <div className="entity-types">
        <div className="message">Select which entity types should be evaluated for tag compliance.</div>
        {types.map((type, t) => (
          <div key={t}>
            <Checkbox
              checked={entityTypes.includes(type)}
              onChange={(e) => this.onChange(type)}
              label={type}
            />
          </div>
        ))}
      </div>
      </>
    );
  }
}
