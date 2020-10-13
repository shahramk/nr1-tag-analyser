import React from 'react';
import PropTypes from 'prop-types';
import { Spinner } from 'nr1';
import { Tab } from 'semantic-ui-react';

import ComplianceBands from './complianceBands';
import EntityTypes from './entityTypes';
import Template from './template';
import { getAccountCollection, writeAccountDocument, getDate } from "../shared/utils/helpers" // SK
import { complianceBands } from '../shared/utils/tag-schema'; // SK
import { resolveConfig } from 'prettier';


const entityTypes = [
    { key: 'a', text: 'Application', value: 'APM' },
    { key: 'b', text: 'Browser', value: 'BROWSER' },
    { key: 'i', text: 'Infrastructure', value: 'INFRA' },
    { key: 'm', text: 'Mobile', value: 'MOBILE' },
    { key: 's', text: 'Synthetics', value: 'SYNTH' },
    // { key: "s", text: "Dashboards", value: "Dashboards" },
    // { key: "s", text: "Workloads", value: "Workloads" },
];

const templates = [
  {
    id: 0,
    name: 'template-global',
    scope: 'global',
    enabled: true,
    createdDate: '2020/10/08 15:18:56',
    lastUpdatedDate: '2020/10/08 15:18:56',
    lastUpdatedBy: 'sk@newrelic.com',
    accounts: [],
    tags: [
        {
            name: "Team",
            mandatory: true,
        },
        {
            name: "Department",
            mandatory: false,
        },
    ],
  },
  {
    id: 1,
    name: 'template-my-cloudfoundry',
    scope: 'account',
    enabled: true,
    createdDate: '2020/10/08 15:18:56',
    lastUpdatedDate: '2020/10/08 15:18:56',
    lastUpdatedBy: 'sk@newrelic.com',
    accounts: [],
    tags: [
        {
            name: "Team",
            mandatory: true,
        },
        {
            name: "Department",
            mandatory: false,
        },
    ],
  },
  {
    id: 2,
    name: 'template-ecs',
    scope: 'account',
    enabled: false,
    createdDate: '2020/10/08 15:18:56',
    lastUpdatedDate: '2020/10/08 15:18:56',
    lastUpdatedBy: 'sk@newrelic.com',
    accounts: [],
    tags: [
        {
            name: "Team",
            mandatory: true,
        },
        {
            name: "Department",
            mandatory: false,
        },
    ],
  },
  {
    id: 3,
    name: 'template-ECS',
    scope: 'account',
    enabled: false,
    createdDate: '2020/10/08 15:18:56',
    lastUpdatedDate: '2020/10/08 15:18:56',
    lastUpdatedBy: 'sk@newrelic.com',
    accounts: [],
    tags: [],
  },
  {
    id: 4,
    name: 'template-My-CloufFoundry',
    scope: 'account',
    enabled: true,
    createdDate: '2020/10/08 15:18:56',
    lastUpdatedDate: '2020/10/08 15:18:56',
    lastUpdatedBy: 'sk@newrelic.com',
    accounts: [],
    tags: [],
  },
  {
    id: 5,
    name: 'template-Ecs',
    scope: 'account',
    enabled: true,
    createdDate: '2020/10/08 15:18:56',
    lastUpdatedDate: '2020/10/08 15:18:56',
    lastUpdatedBy: 'sk@newrelic.com',
    accounts: [],
    tags: [],
  },
  {
    id: 6,
    name: 'template 7',
    scope: 'account',
    enabled: true,
    createdDate: '2020/10/08 15:18:56',
    lastUpdatedDate: '2020/10/08 15:18:56',
    lastUpdatedBy: 'sk@newrelic.com',
    accounts: [],
    tags: [],
  },
  {
    id: 7,
    name: 'template 8',
    scope: 'account',
    enabled: true,
    createdDate: '2020/10/08 15:18:56',
    lastUpdatedDate: '2020/10/08 15:18:56',
    lastUpdatedBy: 'sk@newrelic.com',
    accounts: [],
    tags: [],
  },
];

// const entityTags = [
//     { name: 'language', mandatory: false },
//     { name: 'team', mandatory: true },
//     { name: 'accountId', mandatory: true },
//     { name: 'trustedAccountId', mandatory: false },
//     { name: 'department', mandatory: true },
// ];

export default class Configuration extends React.Component {

  constructor(props) {
      super(props);

      this.templateNameInputRef = React.createRef();
      this.newTag = {
          name: "",
          mandatory: true,
      };
      this.newTemplate = {
        id: -1,
        name: 'template-global',
        scope: 'global',
        enabled: true,
        createdDate: '2020/10/08 15:18:56',
        lastUpdatedDate: '2020/10/08 15:18:56',
        lastUpdatedBy: 'sk@newrelic.com',
        accounts: [],
        tags: [],
        // complianceBands: complianceBands,
        // entityTypes: [],
      };
  }

  state = {
    // value: null,
    templateScope: 'global',
    templateList: templates,
    selectedTemplate: null,

    templateEditMode: false,
    currentTemplate: null,
    currentTag: null,
    templateEntryFormState: "hidden",
    searchInputDisabled: false,
    addTemplateButtonDisabled: false,
    templateEnabledButtonDisabled: false,
    templateEditButtonDisabled: false,
    templateDeleteButtonDisabled: false,


    nerdStoreConfigData: {},
  };

  handleDropdownChange = (event, data, type) => {
    console.log(event, data, type);

    switch (type) {
      case 'accounts':
        break;

      case 'entities':
        this.setState({ 
            selectedEntities: data.value,
        });
        break;
    }
  };

  handleRadio = (event, value) => {
    console.log(event, value);
    this.setState({ templateScope: value.value });
  };

  handleClick = (event, data, type, item) => {
    console.log(event, data);

    switch (type) {
      case 'templateSearch':
        this.setState({
          templateList: templates.filter((t) =>
            t.name.toLowerCase().includes(data.value.toLowerCase())
          ),
        });
        break;

      case 'templateName':
        break;

      case 'highBandMin':
        break;

      case 'midBandMin':
        break;

      case 'midBandMax':
        break;

      case 'lowBandMax':
        break;

      case 'addTemplate':
        this.newTag = {
            name: "",
            mandatory: true,
        };
        this.setState({
            templateEntryFormState: "visible",
            searchInputDisabled: true,
            addTemplateButtonDisabled: true,
            templateEnabledButtonDisabled: true,
            templateEditButtonDisabled: true,
            templateDeleteButtonDisabled: true,
        });
        this.templateNameInputRef.current.focus();
        break;

        case 'editTemplate':
            this.setState({
                templateEditMode: true,
                templateScope: item.scope,
                templateEntryFormState: "visible",
                searchInputDisabled: true,
                addTemplateButtonDisabled: true,
                templateEnabledButtonDisabled: true,
                templateEditButtonDisabled: true,
                templateDeleteButtonDisabled: true,

                currentTemplate: item,
            });
            this.templateNameInputRef.current.focus();
            break;
    
        case 'removeTemplate':
            break;
        
        case 'tagName':
            this.newTag[name] = data.value;
            break;
    
        case 'addTag':
            // // check to make sure tag has proper non-duplicate name
            // const { currentTemplate } = this.state;
            // let tagExists = false;
            // if (currentTemplate.tags.length) {
            //     tagExists = currentTemplate.tags.find(tag => { tag[name] = newTag[name] });
            // }
            // if (tagExists) {
            //     // show message and red box for 2 seconds and set focus to tagName field
            // }
            // else {
            //     currentTemplate.tags.push(newTag);
            //     this.setState({ currentTemplate })
            // }
        
            break;

      case 'removeTag':
        break;

      case 'saveTemplate':
        break;

      case 'cancelTemplate':
        this.newTag = {
            name: "",
            mandatory: true,
        };
        this.setState({
            templateEntryFormState: "hidden",
            searchInputDisabled: false,
            addTemplateButtonDisabled: false,
            templateEnabledButtonDisabled: false,
            templateEditButtonDisabled: false,
            templateDeleteButtonDisabled: false,
          });

        break;

      default:
      // do nothing for now
    }
  };

  submitTemplateChange = () => {
    //
  }

  getNerdStoreConfigData = async () => {
    let nerdStoreConfigData = await this.nerdStore("read", null); // read template config from nerdstore
    console.log(">>> nerdStoreConfigData returned from this.nerdStore(): ", nerdStoreConfigData);

    if (nerdStoreConfigData.templates && nerdStoreConfigData.templates.length === 0) {
      // build defaults from graphql data

      const accountList = this.props.nerdletUrlState.accounts;
      const entityTypes = this.getEntityTypeList() || [];

      nerdStoreConfigData = {
        templates: [
          {
            id: 0,
            name: 'Default Template',
            scope: 'global',
            enabled: true,
            createdDate: getDate(),
            lastUpdatedDate: getDate(),
            lastUpdatedBy: this.props.nerdletUrlState.props.user.email,
            accounts: accountList,
            tags: [],
          }
        ],
        complianceBands: complianceBands,
        entityTypes: entityTypes,
      }

      await this.nerdStore("write", nerdStoreConfigData);
    //   console.log(">>> getNerdStoreConfigData(): setState: defaultConfigData: ", defaultConfigData)
    //   this.setState({ nerdStoreConfigData: defaultConfigData });
    }
    // else {
        console.log(">>> getNerdStoreConfigData(): setState: nerdStoreConfigData: ", nerdStoreConfigData)
    //   this.setState({ nerdStoreConfigData,  });
    // }
    return nerdStoreConfigData;
    
  }

  getEntityTypeList = () => {
    const entityTypes = [];
    Object.keys(this.props.nerdletUrlState.props.tagHierarchy.entityTypes).forEach(entityType => { entityTypes.push(entityType) });
    return entityTypes;
  }

  async nerdStore(mode, nerdStoreData) {
    let result = null;
    if (mode === "write") {
      console.log(">>> writing to nerdstore");
      result = await writeAccountDocument(
        this.props.nerdletUrlState.props.userAccount,
        this.props.nerdletUrlState.props.nerdStoreCollection,
        this.props.nerdletUrlState.props.nerdStoreDocument,
        nerdStoreData
      );
    } else { // mode = "read"
      console.log(">>> reading from nerdstore");
      result = await getAccountCollection(
        this.props.nerdletUrlState.props.userAccount,
        this.props.nerdletUrlState.props.nerdStoreCollection,
        this.props.nerdletUrlState.props.nerdStoreDocument,
      );
      console.log(">>> in nerdstore: read result: ", result);
      if (typeof(result.templates) === "undefined") {
        console.log(mode, ":>>> in nerdstore: empty result");
        return {
          templates: [],
          complianceBands: [],
          entityTypes: [],
        };
      }
      else {
        console.log(mode, "result returned ", result);
        return result;
      }
    }
  }

  componentDidMount() {

    // // const result = 
    // this.getNerdStoreConfigData()
    // .then(result => {
    //     console.log(">>>stackedconfig.componentDidMount->then(): result: ", result);
    //     this.setState({
    //         loading: true,
    //     })
    // });
    // // console.log(">>> componentDidMount.getNerdStoreConfigData: ", result);



    // new Promise((resolve) => {
    //     resolve(this.getNerdStoreConfigData());
    // }).then(result => {
    //     console.log(">>> promise.then() >>> result: ", result);
    //     this.setState({
    //         loading: false,
    //     });
    // });

    this.setState({
        loading: false,
    });

  }

  render() {
    // const { value, templateScope, templateList } = this.state;
    const { loading, templateScope, templateList, nerdStoreConfigData } = this.state;
    const { 
        templateEditMode,
        currentTemplate,
        newTag,
        templateEntryFormState,
        searchInputDisabled,
        addTemplateButtonDisabled,
        templateEnabledButtonDisabled, 
        templateEditButtonDisabled,
        templateDeleteButtonDisabled,
    } = this.state;

    const { nerdletUrlState } = this.props;

    console.log("loading: ", loading);
    return (
        <>
        {loading ? 
            <Spinner />
        : (
            <Tab
                menu={{ pointing: true }}
                panes={[
                {
                    menuItem: 'Templates',
                    render: () => (
                    <Tab.Pane attached={false}>
                            <Template
                                accounts={nerdletUrlState.accounts}
                                nerdStoreCollection={nerdletUrlState.nerdStoreCollection}
                                nerdStoreDocument={nerdletUrlState.nerdStoreDocument}
                                nerdStoreConfigData={this.state.nerdStoreConfigData} // {nerdletUrlState.nerdStoreConfigData}
                                props={nerdletUrlState.props}
                                templateList={this.state.templateList}
                                // tagHierarchy={nerdletUrlState.tagHierarchy}
                                // user={nerdletUrlState.user}
                                // userAccount={nerdletUrlState.userAccount}
                                />
                    </Tab.Pane>
                    ),
                },
                {
                menuItem: 'Entity Types',
                render: () => (
                    <Tab.Pane attached={false}>
                        <EntityTypes 
                            handleClick={this.handleClick} 
                            handleDropdownChange={this.handleDropdownChange}
                        />
                    </Tab.Pane>
                ),
                },
                {
                menuItem: 'Compliance Bands',
                render: () => (
                    <Tab.Pane attached={false}>
                        <ComplianceBands 
                            onClick={this.handleClick} 
                            onDropdownChange={this.handleDropdownChange}
                        />
                    </Tab.Pane>
                ),
                },
            ]}
            />
        )}
        </>
    );
  }
}