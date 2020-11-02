 // NOTE: SET masterAccountId constant to YOUR NEW RELIC MASTER ACCOUNT ID
const masterAccountId = 0;

const nerdStoreInfo = {
    collectionName: 'tag-analyser',
    documentName: 'config',
}

const defaultEntityTypes = [
    "APM", 
    "MOBILE", 
    "BROWSER",
    "INFRA",
    "SYNTH",
]

const defaultComplianceBands = {
    // rule: the loverlimit always falls within the range
    highBand: { upperLimit: 100, lowerLimit: 90,  color: "seagreen"},
    midBand: { upperLimit: 90, lowerLimit: 70, color: "sandybrown"},
    lowBand: { upperLimit: 70, lowerLimit: 0, color: "orangered"},
}

const setComplianceColor = (s, complianceBands) => {
    const score = parseFloat(s);
    if (score >= complianceBands.highBand.lowerLimit) // && score <= complianceBands.highBand.upperLimit)
      return complianceBands.highBand.color;
    else if (complianceBands.midBand.lowerLimit <= score  && score < complianceBands.midBand.upperLimit)
      return complianceBands.midBand.color;
    else
      return complianceBands.lowBand.color;
}

const helpers = {
    masterAccountId,
    nerdStoreInfo,
    defaultEntityTypes,
    defaultComplianceBands,
    setComplianceColor,
};

export default helpers;
