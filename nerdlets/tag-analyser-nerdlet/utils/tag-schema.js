import iconSuccess from "../images/green-check-mark-2.png";
import iconFailure from "../images/red-x-mark-2.png";
import iconWarning from "../images/warning-2.png";

const TAG_SCHEMA_ENFORCEMENT = {
    required: "required",
    recommended: "recommended",
    optional: "optional",
    deprecated: "deprecated",
    prohibited: "prohibited",
}

const SCHEMA = [
    // {
    //     label: 'Open Stack Project',
    //     key: 'osproject',
    //     purpose: '',
    //     enforcement: TAG_SCHEMA_ENFORCEMENT.required,
    //     allowedValues: [],
    // },
    // {
    //     label: 'Open Stack Host',
    //     key: 'oshost',
    //     purpose: '',
    //     enforcement: TAG_SCHEMA_ENFORCEMENT.required,
    //     allowedValues: [],
    // },
    {
        label: 'RPM Account',
        key: 'account',
        purpose: '',
        enforcement: TAG_SCHEMA_ENFORCEMENT.required,
        allowedValues: [],
    },
    {
        label: 'Trusted Account ID',
        key: 'trustedAccountId',
        purpose: '',
        enforcement: TAG_SCHEMA_ENFORCEMENT.required,
        allowedValues: [],
    },
    {
        label: 'Owning Team',
        key: 'Team',
        purpose: '',
        enforcement: TAG_SCHEMA_ENFORCEMENT.required,
        allowedValues: [],
    },
    
    {
        label: 'Language',
        key: 'language',
        purpose: '',
        enforcement: TAG_SCHEMA_ENFORCEMENT.optional,
        allowedValues: [],
    },
    {
        label: 'RPM Account ID',
        key: 'accountId',
        purpose: '',
        enforcement: TAG_SCHEMA_ENFORCEMENT.optional,
        allowedValues: [],
    },

    {
        label: 'Entity Environment',
        key: 'Environment',
        purpose: '',
        enforcement: TAG_SCHEMA_ENFORCEMENT.required,
        allowedValues: ['Dev', 'Test', 'UAT', 'QAT', 'Staging', 'Hotfix', 'Prod', 'NonProd'],
    },
    {
        label: 'Application Name',
        key: 'Applicationname',
        purpose: '',
        enforcement: TAG_SCHEMA_ENFORCEMENT.required,
        allowedValues: [],
    },
    {
        label: 'Product Name',
        key: 'Product',
        purpose: '',
        enforcement: TAG_SCHEMA_ENFORCEMENT.required,
        allowedValues: [],
    },
    {
        label: 'Department Name',
        key: 'Department',
        purpose: '',
        enforcement: TAG_SCHEMA_ENFORCEMENT.required,
        allowedValues: [],
    },





    {
        label: 'Created',
        key: 'created',
        purpose: '',
        enforcement: TAG_SCHEMA_ENFORCEMENT.optional,
        allowedValues: [],
    },
    {
        label: 'Modified',
        key: 'modified',
        purpose: '',
        enforcement: TAG_SCHEMA_ENFORCEMENT.optional,
        allowedValues: [],
    },
    {
        label: 'Operational Hours',
        key: 'operationalhours',
        purpose: '',
        enforcement: TAG_SCHEMA_ENFORCEMENT.optional,
        allowedValues: [],
    },
    {
        label: 'Version Number',
        key: 'version',
        purpose: '',
        enforcement: TAG_SCHEMA_ENFORCEMENT.optional,
        allowedValues: [],
    },
]

const mandatoryTagRules = SCHEMA.filter(s => s.enforcement === TAG_SCHEMA_ENFORCEMENT.required) || []
const optionalTagRules = SCHEMA.filter(s => s.enforcement === TAG_SCHEMA_ENFORCEMENT.optional) || []

const entityTypes = [
    "'APM'", 
    "'MOBILE'", 
    "'BROWSER'",
    "'INFRA'",
    // "'SYNTH'",
]

const complianceBands = {
    // rule: the loverlimit always falls within the range
    highBand: { upperLimit: 100, lowerLimit: 90,  color: "seagreen"},
    midBand: { upperLimit: 90, lowerLimit: 70, color: "sandybrown"},
    lowBand: { upperLimit: 70, lowerLimit: 0, color: "orangered"},
}

const tagDisplay = {
    mandatory: {
      successColor: "seagreen",
      successIcon: iconSuccess,
      failureColor: "orangered",
      failureIcon: iconFailure,
    },
    optional: {
      successColor: "mediumseagreen",
      successIcon: iconSuccess,
      failureColor: "sandybrown",
      failureIcon: iconWarning,
    }
}

const tagStyle = {
    fontSize: "16px",
    // fontWeight: "bold",
    // border: "4px solid dimgray",
    border: "1px solid dimgray",
    borderRadius: "10px",
    margin: "15px 15px",
    padding: "8px",
    // // color: "black",
    // // color: "#F5DEB3", 
    // // color: "navajowhite",
    color: "white",
  }
  
  const setComplianceColor = (s) => {
    let color;
    const score = parseFloat(s);
    if (score >= complianceBands.highBand.lowerLimit) // && score <= complianceBands.highBand.upperLimit)
      color = complianceBands.highBand.color;
    else if (complianceBands.midBand.lowerLimit <= score  && score < complianceBands.midBand.upperLimit)
      color = complianceBands.midBand.color;
    else
      color = complianceBands.lowBand.color;
    
    return color;
}

export {
    SCHEMA, 
    TAG_SCHEMA_ENFORCEMENT, 
    mandatoryTagRules, 
    optionalTagRules, 
    entityTypes,
    complianceBands,
    tagDisplay,
    tagStyle,
    setComplianceColor,
}
