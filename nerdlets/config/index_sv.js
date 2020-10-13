import React from 'react';
import PropTypes from 'prop-types';
import { NerdletStateContext } from 'nr1';
import {
  Form,
  Icon,
  Input,
  Label,
  Tab,
  Table,
  Dropdown,
  Button,
  Checkbox,
  Grid,
} from 'semantic-ui-react';

import ComplianceBands from './complianceBands';
import EntityTypes from './entityTypes';
import Template from './template';
import { getAccountCollection, writeAccountDocument, getDate } from "../shared/utils/helpers"
import { complianceBands, entityTypes } from '../shared/utils/tag-schema';

import Test from './test';

const entityTypes = [
  { key: 'a', text: 'Application', value: 'APM' },
  { key: 'b', text: 'Browser', value: 'BROWSER' },
  { key: 'i', text: 'Infrastructure', value: 'INFRA' },
  { key: 'm', text: 'Mobile', value: 'MOBILE' },
  { key: 's', text: 'Synthetics', value: 'SYNTH' },
];

const templates = [
  {
    id: 1,
    name: 'template-global',
    scope: 'global',
    enabled: true,
    createdDate: '2020/10/08 15:18:56',
    lastUpdatedDate: '2020/10/08 15:18:56',
    lastUpdatedBy: 'sk@newrelic.com',
    entityTypes: [],
    accounts: [],
    mandatoryTags: {},
    optionalTags: {},
    complianceBands: complianceBands,
  },
  {
    id: 2,
    name: 'template-my-cloudfoundry',
    scope: 'account',
    enabled: true,
    createdDate: '2020/10/08 15:18:56',
    lastUpdatedDate: '2020/10/08 15:18:56',
    lastUpdatedBy: 'sk@newrelic.com',
    entityTypes: [],
    accounts: [],
    mandatoryTags: {},
    optionalTags: {},
    complianceBands: {
      highBand: { upperLimit: 100, lowerLimit: 90, color: 'seagreen' },
      midBand: { upperLimit: 90, lowerLimit: 70, color: 'sandybrown' },
      lowBand: { upperLimit: 70, lowerLimit: 0, color: 'orangered' },
    },
  },
  {
    id: 3,
    name: 'template-ecs',
    scope: 'account',
    enabled: false,
    createdDate: '2020/10/08 15:18:56',
    lastUpdatedDate: '2020/10/08 15:18:56',
    lastUpdatedBy: 'sk@newrelic.com',
    entityTypes: [],
    accounts: [],
    mandatoryTags: {},
    optionalTags: {},
    complianceBands: {
      highBand: { upperLimit: 100, lowerLimit: 90, color: 'seagreen' },
      midBand: { upperLimit: 90, lowerLimit: 70, color: 'sandybrown' },
      lowBand: { upperLimit: 70, lowerLimit: 0, color: 'orangered' },
    },
  },
  {
    id: 4,
    name: 'template-ECS',
    scope: 'account',
    enabled: false,
    createdDate: '2020/10/08 15:18:56',
    lastUpdatedDate: '2020/10/08 15:18:56',
    lastUpdatedBy: 'sk@newrelic.com',
    entityTypes: [],
    accounts: [],
    mandatoryTags: {},
    optionalTags: {},
    complianceBands: {
      highBand: { upperLimit: 100, lowerLimit: 90, color: 'seagreen' },
      midBand: { upperLimit: 90, lowerLimit: 70, color: 'sandybrown' },
      lowBand: { upperLimit: 70, lowerLimit: 0, color: 'orangered' },
    },
  },
  {
    id: 5,
    name: 'template-My-CloufFoundry',
    scope: 'account',
    enabled: true,
    createdDate: '2020/10/08 15:18:56',
    lastUpdatedDate: '2020/10/08 15:18:56',
    lastUpdatedBy: 'sk@newrelic.com',
    entityTypes: [],
    accounts: [],
    mandatoryTags: {},
    optionalTags: {},
    complianceBands: {
      highBand: { upperLimit: 100, lowerLimit: 90, color: 'seagreen' },
      midBand: { upperLimit: 90, lowerLimit: 70, color: 'sandybrown' },
      lowBand: { upperLimit: 70, lowerLimit: 0, color: 'orangered' },
    },
  },
  {
    id: 6,
    name: 'template-Ecs',
    scope: 'account',
    enabled: true,
    createdDate: '2020/10/08 15:18:56',
    lastUpdatedDate: '2020/10/08 15:18:56',
    lastUpdatedBy: 'sk@newrelic.com',
    entityTypes: [],
    accounts: [],
    mandatoryTags: {},
    optionalTags: {},
    complianceBands: {
      highBand: { upperLimit: 100, lowerLimit: 90, color: 'seagreen' },
      midBand: { upperLimit: 90, lowerLimit: 70, color: 'sandybrown' },
      lowBand: { upperLimit: 70, lowerLimit: 0, color: 'orangered' },
    },
  },
  {
    id: 7,
    name: 'template 7',
    scope: 'account',
    enabled: true,
    createdDate: '2020/10/08 15:18:56',
    lastUpdatedDate: '2020/10/08 15:18:56',
    lastUpdatedBy: 'sk@newrelic.com',
    entityTypes: [],
    accounts: [],
    mandatoryTags: {},
    optionalTags: {},
    complianceBands: {
      highBand: { upperLimit: 100, lowerLimit: 90, color: 'seagreen' },
      midBand: { upperLimit: 90, lowerLimit: 70, color: 'sandybrown' },
      lowBand: { upperLimit: 70, lowerLimit: 0, color: 'orangered' },
    },
  },
  {
    id: 8,
    name: 'template 8',
    scope: 'account',
    enabled: true,
    createdDate: '2020/10/08 15:18:56',
    lastUpdatedDate: '2020/10/08 15:18:56',
    lastUpdatedBy: 'sk@newrelic.com',
    entityTypes: [],
    accounts: [],
    mandatoryTags: {},
    optionalTags: {},
    complianceBands: {
      highBand: { upperLimit: 100, lowerLimit: 90, color: 'seagreen' },
      midBand: { upperLimit: 90, lowerLimit: 70, color: 'sandybrown' },
      lowBand: { upperLimit: 70, lowerLimit: 0, color: 'orangered' },
    },
  },
];

const entityTags = [
  { name: 'language', mandatory: false },
  { name: 'team', mandatory: true },
  { name: 'accountId', mandatory: true },
  { name: 'trustedAccountId', mandatory: false },
  { name: 'department', mandatory: true },
];

export default class Configuration extends React.Component {
//   static propTypes = {
//     //   accounts: PropTypes.array.isRequired,
//       tagAnalyserNerdStore: PropTypes.object.isRequired
//   };

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
        entityTypes: [],
        accounts: [],
        tags: [],
        mandatoryTags: {},
        optionalTags: {},
        complianceBands: complianceBands,

    
      };

  };

  state = {
    // value: null,
    templateScope: 'global',
    templateList: templates,
    selectedTemplate: null,

    templateEntryFormState: "hidden",
    searchInputDisabled: false,
    addTemplateButtonDisabled: false,
    taemplateEnabledButtonDisabled: false,
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

  addNewTag = (newTag) => {
    this.newTemplate.tags.push(newTag);
  }

  handleClick = (event, data, type) => {
    console.log(event, data);

    switch (type) {
      case 'templateSearch':
        this.setState({
          templateList: templates.filter((t) =>
            t.name.toLowerCase().includes(data.value.toLowerCase())
          ),
        });
        break;

      case 'NewTemplateName':
        break;

      case 'highBandMin':
        break;

      case 'midBandMin':
        break;

      case 'midBandMax':
        break;

      case 'lowBandMax':
        break;

      case 'tagName':
        this.newTag.name = data.value;
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
        taemplateEnabledButtonDisabled: true,
        templateEditButtonDisabled: true,
        templateDeleteButtonDisabled: true,
        });
        this.templateNameInputRef.current.focus();

        break;

      case 'addTag':
        // check to make sure tag has proper non-0duplicate name
        let tagExists = false;
        if (this.newTemplate.tags.length) {
            tagExists = this.newTemplate.tags.find(tag => { tag.name = newTag.name });
        }
        if (tagExists) {
            // show message and red box for 2 seconds and set focus to tagName field
        }
        this.addNewTag(newTag);
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
            taemplateEnabledButtonDisabled: false,
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

  render() {
    // const { value, templateScope, templateList } = this.state;
    const { templateScope, templateList, nerdStoreConfigData } = this.state;
    const { 
        templateEntryFormState,
        searchInputDisabled,
        addTemplateButtonDisabled,
        taemplateEnabledButtonDisabled, 
        templateEditButtonDisabled,
        templateDeleteButtonDisabled,
    } = this.state;

    const { newTemplate, newTag } = this;

    return (
      <NerdletStateContext.Consumer>
        {(nerdletUrlState) => (
          <Tab
            menu={{ pointing: true }}
            panes={[
            {
                menuItem: 'Templates',
                render: () => (
                  <Tab.Pane attached={false}>
                    <Grid
                      style={{ margin: '10px', padding: '10px' }}
                      verticalAlign={'middle'}
                      columns={3}
                    >
                      <Grid.Row>
                        {' '}
                        {/* config form heading */}
                        <Grid.Column width={16}>
                          <center>
                            <Label
                              style={{
                                backgroundColor: 'lightgrey',
                                fontSize: '18px',
                              }}
                            >
                              Entity Tags Template Configuration
                            </Label>
                          </center>
                        </Grid.Column>
                      </Grid.Row>

                      <Grid.Row
                        style={{
                          backgroundColor: 'lightgray',
                          border: '1px solid gray',
                          marginLeft: '12px',
                          marginRight: '12px',
                        }}
                      >
                        <Grid.Column width={5}>
                          {' '}
                          {/* search template */}
                          <Label style={{ backgroundColor: 'lightgray' }}>
                            Search Templates:{' '}
                          </Label>
                          <Input
                            style={{
                              width: '50%',
                              backgroundColor: 'white',
                              border: '1px solid black',
                              padding: '3px',
                            }}
                            disabled={searchInputDisabled}
                            // label="Search Templates: "
                            placeholder="Partial template name..."
                            onChange={(event, data) =>
                              this.handleClick(event, data, 'templateSearch')
                            }
                          />
                        </Grid.Column>
                        <Grid.Column width={8}>
                          {' '}
                          {/* space */}
                          <></>
                        </Grid.Column>
                        <Grid.Column width={3}>
                          {' '}
                          {/* add template button */}
                          <Button
                            floated="right"
                            color={'teal'}
                            disabled={addTemplateButtonDisabled}
                            onClick={(event, data) =>
                              this.handleClick(event, data, 'addTemplate')
                            }
                          >
                            <Icon name="add" /> Add Template
                          </Button>
                        </Grid.Column>
                      </Grid.Row>

                      <Grid.Row>
                        {' '}
                        {/* templates table */}
                        <Grid.Column width={16}>
                          {' '}
                          {/* templates table */}
                          <div
                            style={{
                              minHeight: '200px',
                              maxHeight: '300px',
                              overflow: 'auto',
                              border: '1px solid black',
                            }}
                          >
                            <Table celled compact definition>
                              <Table.Header fullWidth>
                                <Table.Row>
                                  <Table.HeaderCell>Enabled</Table.HeaderCell>
                                  <Table.HeaderCell>Name</Table.HeaderCell>
                                  <Table.HeaderCell>Scope</Table.HeaderCell>
                                  <Table.HeaderCell>Created</Table.HeaderCell>
                                  <Table.HeaderCell>
                                    Last Edited
                                  </Table.HeaderCell>
                                  <Table.HeaderCell>
                                    Last Edited By
                                  </Table.HeaderCell>
                                  <Table.HeaderCell>
                                    <center>Actions</center>
                                  </Table.HeaderCell>
                                </Table.Row>
                              </Table.Header>

                              <Table.Body>
                                {templateList.map((template) => {
                                  return (
                                    <Table.Row key={template.id}>
                                      <Table.Cell collapsing>
                                        <Checkbox
                                          toggle
                                          disabled={taemplateEnabledButtonDisabled}
                                          defaultChecked={template.enabled}
                                        />
                                      </Table.Cell>
                                      <Table.Cell>{template.name}</Table.Cell>
                                      <Table.Cell>{template.scope}</Table.Cell>
                                      <Table.Cell>
                                        {template.createdDate.toString()}
                                      </Table.Cell>
                                      <Table.Cell>
                                        {template.lastUpdatedDate.toString()}
                                      </Table.Cell>
                                      <Table.Cell>
                                        {template.lastUpdatedBy.toString()}
                                      </Table.Cell>
                                      <Table.Cell>
                                        <Button
                                          style={{ marginLeft: '20px' }}
                                          disabled={templateEditButtonDisabled}
                                          floated="left"
                                          // icon
                                          // labelPosition='left'
                                          // primary
                                          size="small"
                                        >
                                          Edit
                                        </Button>
                                        <Button
                                          style={{ marginRight: '20px' }}
                                          disabled={templateDeleteButtonDisabled}
                                          floated="right"
                                          // icon
                                          // labelPosition='left'

                                          size="small"
                                        >
                                          Delete
                                        </Button>
                                      </Table.Cell>
                                    </Table.Row>
                                  );
                                })}
                              </Table.Body>

                              <Table.Footer fullWidth>
                                <Table.Row>
                                  <Table.HeaderCell />
                                  <Table.HeaderCell>
                                    {templateList.length} Template(s)
                                  </Table.HeaderCell>
                                  <Table.HeaderCell />
                                  <Table.HeaderCell />
                                  <Table.HeaderCell />
                                  <Table.HeaderCell />
                                  <Table.HeaderCell />
                                </Table.Row>
                              </Table.Footer>
                            </Table>
                          </div>
                        </Grid.Column>
                      </Grid.Row>

                      {/* <Grid.Row columns={1}>
                        <Grid.Column>
                          <><br/><br/><br/></>
                        </Grid.Column>
                      </Grid.Row> */}

                    </Grid>


                    { /* template form */}
                    <Grid style={{visibility: templateEntryFormState }}>
                      <Grid.Row>
                        <Grid.Column width={5}>
                          {/* template name */}
                          <Label
                            style={{ width: '120px', backgroundColor: 'white' }}
                          >
                            Template Name:{' '}
                          </Label>
                          <Input
                            // label="Template Name: "
                            // defaultValue={'my-cloudfoundry'}
                            style={{
                              height: '40px',
                              width: '200px',
                              border: '1px solid black',
                              padding: '10px',
                            }}
                            ref={this.templateNameInputRef}
                            placeholder="Template name..."
                            onChange={(event, data) =>
                              this.handleClick(event, data, 'NewTemplateName')
                            }
                          />
                        </Grid.Column>

                        <Grid.Column
                          style={{ height: '40px' }}
                          width={4}
                          floating="right"
                        >
                          {' '}
                          {/* template scope */}
                          <Form>
                            <Form.Group>
                              <label>
                                Template Scope&nbsp;&nbsp;&nbsp;&nbsp;
                              </label>
                              <Form.Radio
                                label="Global"
                                value="global"
                                checked={templateScope === 'global'}
                                onChange={this.handleRadio}
                              />
                              <Form.Radio
                                label="Account"
                                value="account"
                                checked={templateScope === 'account'}
                                onChange={this.handleRadio}
                              />
                            </Form.Group>
                          </Form>
                        </Grid.Column>

                        <Grid.Column
                          style={{ height: '40px', border: '1px solid black' }}
                          width={7}
                        >
                          {' '}
                          {/* accounts dropdown */}
                          <Dropdown
                            disabled={templateScope !== 'account'}
                            className="ui multiple selection dropdown"
                            placeholder="Accounts..."
                            options={nerdletUrlState.accounts}
                            // simple
                            clearable
                            fluid
                            multiple
                            search
                            selection
                            scrolling
                            onChange={(event, data) => {
                              this.handleDropdownChange(
                                event,
                                data,
                                'accounts'
                              );
                            }}
                          />
                        </Grid.Column>
                      </Grid.Row>

                      <Grid.Row>
                        <Grid.Column width={16}>
                          <><br/><br/><br/></>
                        </Grid.Column>
                      </Grid.Row>

                      <Grid.Row>
                        <Grid.Column width={2}>
                          <><br/><br/></>
                        </Grid.Column>

                        <Grid.Column
                          style={{ border: '1px solid blue' }}
                          width={9}
                        >
                          {' '}
                          {/* entity tags */}
                          <div
                            style={{
                              border: '1px solid blue',
                              marginTop: '3px',
                            }}
                          >
                            <center>
                              <Label
                                style={{
                                  backgroundColor: 'lightgrey',
                                  fontSize: '14px',
                                  marginTop: '3px',
                                }}
                              >
                                Entity Tags
                              </Label>
                            </center>
                            <br />
                            <label>Tag Name:&nbsp;&nbsp;</label>
                            <Input
                              style={{
                                border: '1px solid black',
                                padding: '5px',
                              }}
                              // label="Tag Name"
                              placeholder="Enter tag..."
                              onChange={(event, data) =>
                                this.handleClick(event, data, 'tagName')
                              }
                            />
                            <Checkbox label="Mandatory" defaultChecked />
                            <Button
                              style={{ marginLeft: '20px' }}
                              // floated='right'
                              // color={"teal"}
                              onClick={(event, data) =>
                                this.handleClick(event, data, 'addTag')
                              }
                            >
                              <Icon name="add" /> Add Tag
                            </Button>
                          </div>
                          <div
                            style={{
                              border: '1px solid blue',
                              marginTop: '5px',
                              paddingTop: '30px',
                              paddingBottom: '10px',
                            }}
                          >
                            {entityTags.map((tag) => {
                              return (
                                <div key={tag.name}>
                                  <label>Tag Name:&nbsp;&nbsp;</label>
                                  <Label
                                    style={{
                                      width: '30%',
                                      backgroundColor: 'white',
                                      marginTop: '3px',
                                    }}
                                  >
                                    {tag.name}
                                  </Label>
                                  <Checkbox
                                    label="Mandatory"
                                    checked={tag.mandatory}
                                    disabled={true}
                                  />
                                  <Button
                                    style={{ marginLeft: '20px' }}
                                    onClick={(event, data) =>
                                      this.handleClick(event, data, 'removeTag')
                                    }
                                  >
                                    <Icon name="remove" /> Remove Tag
                                  </Button>
                                </div>
                              );
                            })}
                          </div>
                        </Grid.Column>
                      </Grid.Row>

                      <Grid.Row
                        columns={3}
                        style={{ border: '1px solid blue' }}
                      >
                        {' '}
                        {/* buttons */}
                        <Grid.Column width={12}>
                          {' '}
                          {/* space */}
                          <></>
                        </Grid.Column>
                        <Grid.Column width={4}>
                          {' '}
                          {/* buttons cancel / save */}
                          <Button
                            floated="right"
                            color={'blue'}
                            onClick={(event, data) =>
                              this.handleClick(event, data, 'saveTemplate')
                            }
                          >
                            <Icon name="checkmark" /> Save
                          </Button>
                          <Button
                            floated="right"
                            color={'grey'}
                            onClick={(event, data) =>
                              this.handleClick(event, data, 'cancelTemplate')
                            }
                          >
                            <Icon name="arrow alternate circle left outline" />{' '}
                            Cancel
                          </Button>
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>

                  </Tab.Pane>
                ),
            },
            {
            menuItem: 'Entity Types',
            render: () => (
                <Tab.Pane attached={false}>
                <EntityTypes handleClick={this.handleClick} handleDropdownChange={this.handleDropdownChange} />
                </Tab.Pane>
            ),
            },
            {
            menuItem: 'Compliance Bands',
            render: () => (
                <Tab.Pane attached={false}>
                <ComplianceBands onClick={this.handleClick} onDropdownChange={this.handleDropdownChange} />
                </Tab.Pane>
            ),
            },


                // {
                //     menuItem: "Template Form 2",
                //     render: () => (
                //       <Tab.Pane attached={false}>
                //       <Test/>
                //       </Tab.Pane>
                //     ),
                // },



                //   {
                //     menuItem: "Template Form",
                //     render: () => (
                //       <Tab.Pane attached={false}>
                //         <Grid>
                //             <Grid.Row>
                //             <Grid.Column width={16}>
                //                 <Form
                //                     onSubmit={this.submitTemplateChange}
                //                 >
                //                     <Input
                //                         // label="Template Name: "
                //                         // defaultValue={'my-cloudfoundry'}
                //                         style={{
                //                         height: '40px',
                //                         width: '200px',
                //                         border: '1px solid black',
                //                         padding: '10px',
                //                         }}
                //                         placeholder="Template name..."
                //                         onChange={(event, data) =>
                //                             this.handleClick(event, data, 'NewTemplateName')
                //                         }
                //                     />
    
                //                     <Form.Group>
                //                         <label>Template Scope&nbsp;&nbsp;&nbsp;&nbsp;</label>
                //                         <Form.Radio
                //                             label="Global"
                //                             value="global"
                //                             checked={templateScope === 'global'}
                //                             onChange={this.handleRadio}
                //                         />
                //                         <Form.Radio
                //                             label="Account"
                //                             value="account"
                //                             checked={templateScope === 'account'}
                //                             onChange={this.handleRadio}
                //                         />
                //                     </Form.Group>
    
                //                     <Dropdown
                //                         disabled={templateScope !== 'account'}
                //                         className="ui multiple selection dropdown"
                //                         placeholder="Accounts..."
                //                         options={nerdletUrlState.accounts}
                //                         // simple
                //                         clearable
                //                         fluid
                //                         multiple
                //                         search
                //                         // selection
                //                         scrolling
                //                         onChange={(event, data) => {
                //                         this.handleDropdownChange(event, data, 'accounts');
                //                         }}
                //                     />
    
                //                     <Form.Group>
                //                         <label>Tag Name:&nbsp;&nbsp;</label>
                //                         <Input
                //                         style={{
                //                             border: '1px solid black',
                //                             padding: '5px',
                //                         }}
                //                         // label="Tag Name"
                //                         placeholder="Enter tag..."
                //                         onChange={(event, data) =>
                //                             this.handleClick(event, data, 'tagName')
                //                         }
                //                         />
                //                         <Checkbox label="Mandatory" defaultChecked />
                //                         <Button
                //                         style={{ marginLeft: '20px' }}
                //                         // floated='right'
                //                         // color={"teal"}
                //                         onClick={(event, data) => this.handleClick(event, data, 'addTag')}
                //                         >
                //                         <Icon name="add" /> Add Tag
                //                         </Button>
                //                     </Form.Group>
    
                //                     <Form.Group> 
                //                         <Button
                //                         floated="right"
                //                         color={'blue'}
                //                         onClick={(event, data) =>
                //                             this.handleClick(event, data, 'saveTag')
                //                         }
                //                         >
                //                         <Icon name="checkmark" /> Save
                //                         </Button>
                //                         <Button
                //                         floated="right"
                //                         color={'grey'}
                //                         onClick={(event, data) =>
                //                             this.handleClick(event, data, 'cancelTag')
                //                         }
                //                         >
                //                         <Icon name="arrow alternate circle left outline" />{' '}
                //                         Cancel
                //                         </Button>
                //                     </Form.Group>
     
                //                 </Form>
                //             </Grid.Column>
                //             </Grid.Row>
                //         </Grid>
                //       </Tab.Pane>
                //     ),
                // },




            //       {
            //       menuItem: "Template Form 2",
            //       render: () => (
            //         <Tab.Pane attached={false}>
            //         <Template
            //             accounts={nerdletUrlState.accounts}
            //             handleClick={this.handleClick}
            //             handleRadio={this.handleRadio}
            //             handleDropdownChange={this.handleDropdownChange}
            //         />
            //         </Tab.Pane>
            //       ),
            //   },


        ]}
          />
        )}
      </NerdletStateContext.Consumer>
    );
  }
}
