import React from 'react';
import PropTypes from 'prop-types';

import {
    Grid,
    Form,
    Icon,
    Input,
    Label,
    Table,
    Dropdown,
    Button,
    Checkbox,
  } from 'semantic-ui-react';
  import { getDate } from "../shared/utils/helpers" // SK

export default class Template extends React.Component {
    static propTypes = {
        accounts: PropTypes.array.isRequired,
        nerdStoreCollection: PropTypes.string.isRequired,
        nerdStoreDocument: PropTypes.string.isRequired,
        nerdStoreConfigData: PropTypes.object.isRequired,
        props: PropTypes.object.isRequired,
        templateList: PropTypes.array.isRequired,
        // tagHierarchy: PropTypes.object.isRequired,
        // user: PropTypes.object.isRequired,
        // userAccount: PropTypes.number.isRequired,
    };

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
    };
  
    state = {
      // value: null,
      templateScope: 'global',
      templateList: this.props.templateList,
      selectedTemplate: null,
  
      templateEditMode: "",
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
                const { currentTemplate } = this.state;
                currentTemplate.accounts = data.value;
                this.setState({ currentTemplate });
                break;
        }
    };

    handleRadio = (event, value) => {
        console.log(event, value);
        this.setState({ templateScope: value.value });
    };
    
    makeTemplateFormVisible = (mode) => {
        this.setState({
            templateEntryFormState: mode ? "visible" : "hidden",
            searchInputDisabled: mode,
            addTemplateButtonDisabled: mode,
            templateEnabledButtonDisabled: mode,
            templateEditButtonDisabled: mode,
            templateDeleteButtonDisabled: mode,
        });
    }

    handleClick = (event, data, type, item) => {
        console.log("event: ", event, "\ndata: ", data, "\ntype: ", type, "\nitem: ", item);
        console.log("newTag: ", this.newTag);
    
        switch (type) {
            case 'templateSearch':
                this.setState({
                templateList: this.props.templateList.filter((t) =>
                    t.name.toLowerCase().includes(data.value.toLowerCase())
                ),
                });
                break;
    
            case 'templateName':
                {
                const { currentTemplate } = this.state;
                currentTemplate.name = data.value;
                this.setState({ currentTemplate });
                break;
                }
    
            case 'addTemplate':
                this.newTag = {
                    name: "",
                    mandatory: true,
                };
                this.makeTemplateFormVisible(true);
                this.setState({
                    templateEditMode: "add",
                    templateScope: "global",
                    currentTemplate: {
                        id: -1,
                        name: '',
                        scope: 'global',
                        enabled: true,
                        createdDate: getDate(),
                        lastUpdatedDate: getDate(),
                        lastUpdatedBy: this.props.props.user.email,
                        accounts: [],
                        tags: [],
                    },
                });
                // this.templateNameInputRef.current.focus();
                break;
    
            case 'editTemplate':
                this.makeTemplateFormVisible(true);
                this.setState({
                    templateEditMode: "update",
                    templateScope: item.scope,
                    currentTemplate: {...item},
                });
                this.templateNameInputRef.current.focus();
                break;
        
            case 'removeTemplate': {
                    console.log("before delete: ", this.props.templateList);

                    this.props.templateList.forEach((template, index) => {
                        if (template.name === item.name && template.id === item.id) {
                            this.props.templateList.splice(index, 1);
                        }
                    });
                    this.setState({ templateList: this.props.templateList });

                    console.log("after delete: ", this.props.templateList);
                }
                break;
            
            case 'tagName':
                this.newTag.name = data.value;
                break;
        
            case 'mandatoryTag':
                this.newTag.mandatory = data.checked;
                break;
            
            case 'addTag': {
                    if (this.newTag.name == "") {
                        // display message and do not add tag
                        alert("Tags with blank name are not allowed");
                    }
                    else {
                        // check to make sure tag has proper non-duplicate name
                        const { currentTemplate } = this.state;
                        let tagExists = false;
                        if (currentTemplate.tags.length) {
                            tagExists = currentTemplate.tags.find(tag => { tag[name] = this.newTag[name] });
                        }

                        if (tagExists) {
                            // show message and red box for 2 seconds and set focus to tagName field
                        }
                        else {
                            currentTemplate.tags.push(this.newTag);
                            this.newTag = {
                                name: "",
                                mandatory: true,
                            };
                            this.setState({ currentTemplate })
                        }
                    }
                }
                break;
    
            case 'removeTag': {
                    const { templateEditMode, currentTemplate } = this.state;
                    if (templateEditMode !== "" && currentTemplate !== null) {
                        const tags = currentTemplate.tags.filter(tag => tag.name !== item.name);
                        currentTemplate.tags = tags;
                        this.setState({ currentTemplate });
                    }
                }
                break;
    
            case 'saveTemplate': {
                        const { templateEditMode, currentTemplate } = this.state;
                        // let { templateList } = this.state;
                        if (templateEditMode !== "" && currentTemplate !== null) {
                            // check for errors
                            if (templateEditMode === "update") {

                                currentTemplate.lastUpdatedDate = getDate();
                                currentTemplate.lastUpdatedBy = this.props.props.user.email;
                                this.props.templateList.forEach((template, index) => {
                                    if (template.id === currentTemplate.id) {
                                        this.props.templateList[index] = currentTemplate;
                                    }
                                });
                            }
                            else if (templateEditMode === "add") {
                                currentTemplate.id = this.props.templateList.reduce((max, current) => current.id > max ? current.id : max, this.props.templateList[0].id)+1,
                                currentTemplate.createdDate = getDate();
                                currentTemplate.lastUpdatedDate = getDate();
                                currentTemplate.lastUpdatedBy = this.props.props.user.email;
                                this.props.templateList.push(currentTemplate);
                            }
                            
                            

                            this.makeTemplateFormVisible(false);
                            this.setState({
                                templateEditMode: "",
                                templateScope: "global",
                                currentTemplate: null,
                            });
                        }
                    }
                    break;
    
            case 'cancelTemplate':
                this.newTag = {
                    name: "",
                    mandatory: true,
                };
                this.makeTemplateFormVisible(false);  
                this.setState({
                    templateEditMode: "",
                    templateScope: "global",
                    currentTemplate: null,
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
        const { templateScope, templateList } = this.state;
        const { 
            templateEditMode,
            currentTemplate,
            templateEntryFormState,
            searchInputDisabled,
            addTemplateButtonDisabled,
            templateEnabledButtonDisabled, 
            templateEditButtonDisabled,
            templateDeleteButtonDisabled,
        } = this.state;

        const { nerdStoreConfigData } = this.props;

        // const { nerdletUrlState } = this.props;
        const { accounts } = this.props;


        return (
            <>
                { /* template list */}
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
                                        key={`template_enabled_${template.id}`}
                                        toggle
                                        disabled={templateEnabledButtonDisabled}
                                        defaultChecked={template.enabled}
                                    />
                                    </Table.Cell>
                                    <Table.Cell key={`template_name_${template.id}`}>{template.name}</Table.Cell>
                                    <Table.Cell key={`template_scope_${template.id}`}>{template.scope}</Table.Cell>
                                    <Table.Cell key={`template_createdDate_${template.id}`}>
                                    {template.createdDate.toString()}
                                    </Table.Cell>
                                    <Table.Cell key={`template_lastUpdatedDate_${template.id}`}>
                                    {template.lastUpdatedDate.toString()}
                                    </Table.Cell>
                                    <Table.Cell key={`template_lastUpdatedBy_${template.id}`}>
                                    {template.lastUpdatedBy.toString()}
                                    </Table.Cell>
                                    <Table.Cell key={`template_actions_${template.id}`}>
                                    <Button
                                        style={{ marginLeft: '20px' }}
                                        key={`template_action_edit_${template.id}`}
                                        disabled={templateEditButtonDisabled}
                                        floated="left"
                                        // icon
                                        // labelPosition='left'
                                        // primary
                                        size="small"
                                        onClick={(event, data) =>
                                        this.handleClick(event, data, 'editTemplate', template)
                                        }
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        style={{ marginRight: '20px' }}
                                        key={`template_action_delete_${template.id}`}
                                        disabled={templateDeleteButtonDisabled}
                                        floated="right"
                                        // icon
                                        // labelPosition='right'

                                        size="small"
                                        onClick={(event, data) =>
                                        this.handleClick(event, data, 'removeTemplate', template)
                                        }
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
                    <Grid.Column width={4}>
                        <><br/><br/><br/></>
                    </Grid.Column>
                    <Grid.Column width={8}>
                        {/* template name */}
                        <div style={{display: "flex", alignItems: "center"}}>
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
                        defaultValue={templateEditMode && currentTemplate.name ? currentTemplate.name : ""}
                        placeholder="Template name..."
                        onChange={(event, data) =>
                            this.handleClick(event, data, 'templateName')
                        }
                        />
                        </div>
                    </Grid.Column>
                    </Grid.Row>
                    
                    <Grid.Row>
                    <Grid.Column width={4}>
                        <><br/><br/><br/></>
                    </Grid.Column>

                    <Grid.Column
                        style={{ height: '40px' }}
                        width={8}
                        floating="right"
                    >
                        {' '}
                        {/* template scope */}
                        <div style={{display: "flex", alignItems: "center"}}>
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
                        </div>
                    </Grid.Column>
                    </Grid.Row>
                    
                    <Grid.Row>
                    <Grid.Column width={4}>
                        <><br/><br/><br/></>
                    </Grid.Column>
                    <Grid.Column
                        style={{ height: '40px', border: '1px solid black' }}
                        width={8}
                    >
                        {' '}
                        {/* accounts dropdown */}
                        <div style={{display: "flex", alignItems: "center"}}>
                        <Label
                        style={{ width: '120px', backgroundColor: 'white' }}
                        >
                        Accounts:{' '}
                        </Label>
                        <Dropdown
                        disabled={templateScope !== 'account'}
                        className="ui multiple selection dropdown"
                        placeholder="Accounts..."
                        options={accounts}
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
                        </div>
                    </Grid.Column>
                    </Grid.Row>

                    {/* <Grid.Row>
                    <Grid.Column width={16}>
                        <><br/><br/><br/></>
                    </Grid.Column>
                    </Grid.Row> */}


                    <Grid.Row>
                    <Grid.Column width={4}>
                        <><br/><br/></>
                    </Grid.Column>

                    <Grid.Column
                        style={{ border: '2px solid black' }}
                        width={8}
                    >
                        {' '}
                        {/* entity tags */}
                        <div
                        style={{
                            border: '1px solid black',
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
                        <Input id='mytagnameinput'
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
                        <Checkbox 
                            label="Mandatory" 
                            defaultChecked
                            onChange={(event, data) =>
                                this.handleClick(event, data, 'mandatoryTag')
                            }
                        />
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
                            border: '1px solid black',
                            marginTop: '5px',
                            paddingTop: '30px',
                            paddingBottom: '10px',
                        }}
                        >
                        {currentTemplate ? currentTemplate.tags.map((tag) => {
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
                                    this.handleClick(event, data, 'removeTag', tag)
                                }
                                >
                                <Icon name="remove" /> Remove Tag
                                </Button>
                            </div>
                            );
                        })
                        : null}
                        </div>
                    </Grid.Column>
                    </Grid.Row>

                    <Grid.Row
                    columns={3}
                    style={{ border: '2px solid black' }}
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
            </>
        );
    };
}