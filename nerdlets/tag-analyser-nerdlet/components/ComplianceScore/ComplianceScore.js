import React from 'react'
import { complianceBands } from '../../utils/tag-schema';

const ComplianceScore = ({ compliance, select }) => {
  const { type, name, score, active, entityCount } = compliance

  const getComplianceBand = () => {
    if (score >= complianceBands.highBand.lowerLimit)
      return 'high__band';
    else if (complianceBands.midBand.lowerLimit <= score  && score < complianceBands.midBand.upperLimit)
      return 'mid__band';
    else
      return 'low__band';
  }

  const title = type === 'account' ? 'OVERALL' : name;
  const band = getComplianceBand();
  const status = !active ? 'lightgray' : band;
  
  return (
    <div className={`compliance__score__container `}>
      <div
        onClick={() => select(type, name)}
        className={`compliance__score ${status} ${name==='account' ? 'summary' : ''}`}
      >
        <span>
        <label className="title">{title}</label>
        <label className="subtitle">({entityCount} entities)</label>
        </span>
        <label className="value">{`${score}%`}</label>
      </div>
    </div>
  );
}

export default ComplianceScore