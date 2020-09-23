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
]


export {
    SCHEMA, 
    TAG_SCHEMA_ENFORCEMENT, 
    mandatoryTagRules, 
    optionalTagRules, 
    entityTypes
}
