import iconSuccess from "../images/green-check-mark-2.png";
import iconFailure from "../images/red-x-mark-2.png";
import iconWarning from "../images/warning-2.png";


const masterAccountId = 192626;

const nerdStoreInfo = {
    collectionName: 'tag-analyser',
    documentName: 'config',

    // good test data -- rpd id 739516
    // collectionName: 'tag-analyser-test8',
    // documentName: 'config-test8',
}

const defaultEntityTypes = [
    "'APM'", 
    "'MOBILE'", 
    "'BROWSER'",
    "'INFRA'",
    "'SYNTH'",
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
