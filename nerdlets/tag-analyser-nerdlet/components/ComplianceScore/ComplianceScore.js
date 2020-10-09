import React from 'react';
import PropTypes from 'prop-types';

const ComplianceScore = ({ compliance, select }) => {
  const { type, name, score, band, active, entityCount } = compliance;

  const title = type === 'account' ? 'OVERALL' : name;
  const status = !active ? 'inactive__entity' : band;

  return (
    <div className={`compliance__score__container `}>
      <div
        onClick={() => select(type, name)}
        className={`compliance__score ${status} ${
          name === 'account' ? 'summary' : ''
        }`}
      >
        <span>
          <label className="title">{title}</label>
          <label className="subtitle">({entityCount} entities)</label>
        </span>
        <label className="value">{`${score}%`}</label>
      </div>
    </div>
  );
};

ComplianceScore.propTypes = {
  compliance: PropTypes.object.isRequired,
  select: PropTypes.func.isRequired,
};

export default ComplianceScore;
