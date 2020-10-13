import React from "react";
import PropTypes from 'prop-types';
import { Icon, Input, Label, List, Button, Grid, Dropdown } from "semantic-ui-react";

const entityTypes = [
    { key: "a", text: "Application", value: "APM" },
    { key: "b", text: "Browser", value: "BROWSER" },
    { key: "i", text: "Infrastructure", value: "INFRA" },
    { key: "m", text: "Mobile", value: "MOBILE" },
    { key: "s", text: "Synthetics", value: "SYNTH" },
    // { key: "s", text: "Dashboards", value: "Dashboards" },
    // { key: "s", text: "Workloads", value: "Workloads" },
  ];

export default class EntityTypes extends React.Component {
    static propTypes = {
        handleDropdownChange: PropTypes.func.Required,
        handleClick: PropTypes.func,
    }

    state = {
        value: null,
        selectedTemplate: null,
        selectedEntities: ["APM", "INFRA"],
    };

    handleClick = (event, data, type) => {
        console.log(event, data);

        switch (type) {
            case "saveTemplate":

                break;

            case "cancelTemplate":

                break;
    
        }
    }

    handleDropdownChange = (event, data, type) => {
        console.log(event, data, type);

        switch (type) {
            case "accounts":
                break;

            case "entities":
                this.setState({ 
                    selectedEntities: data.value,
                });
                break;
        }
    }

    render() {
        const { selectedEntities } = this.state;
        const { handleClick, handleDropdownChange } = this;
        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column style={{height: "100px"}} width={16}>
                        <></>
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                    <Grid.Column style={{height: "300px"}} width={1}>
                        <></>
                    </Grid.Column>

                    <Grid.Column style={{height: "100px", border: "1px solid black", marginLeft: "10px"}} width={11}> {/* entity types dropdown */}
                        <div>
                            <label>Select Accounts from Dropdown</label>
                        </div>
                        <div>
                        <Dropdown 
                            // className="ui multiple selection dropdown"
                            // placeholder="Entity types..."
                            // options={entityTypes}
                            // // simple
                            // // clearable
                            // fluid
                            // multiple
                            // search
                            // selection
                            // scrolling
                            // onChange={(event, data) => {
                            //     handleDropdownChange(event, data, "entities");
                            // }}
                            className="menu__bar__semantic__dropdown"
                            style={{ minWidth: '20rem' }}
                            placeholder="Entity types..."
                            options={entityTypes}
                            // simple
                            multiple
                            search
                            selection
                            scrolling
                            value={selectedEntities}
                            onChange={(event, data) => {
                                handleDropdownChange(event, data, "entities");
                            }}
                        />
                        </div>

                        <div>
                            <br/><br/><br/>
                            <Button
                                floated='right'
                                color={"blue"}
                                onClick={(event, data) => handleClick(event, data, "saveTemplate")}
                            >
                                <Icon name="checkmark" /> Save
                            </Button>
                            <Button
                                floated='right'
                                color={"grey"}
                                onClick={(event, data) => handleClick(event, data, "cancelTemplate")}
                            >
                                <Icon name="arrow alternate circle left outline" /> Cancel
                            </Button>
                        </div>
                    </Grid.Column>

                    <Grid.Column style={{height: "300px", marginLeft: "10px"}} width={3}>
                        {selectedEntities.length ? 
                            <>
                            <label>Selected Entities</label>
                            <List>
                                {selectedEntities.map((item) => {
                                    return (
                                        <List.Item
                                            key={item}
                                            style={{height: "30px"}}
                                            // onClick={(event, data) => this.handleListItemClick(event, data)}
                                        >
                                            <Icon name="file alternate outline" />
                                            &nbsp;&nbsp;
                                            {item}
                                        </List.Item>
                                    );
                                })}
                            </List>
                            </>
                        : null}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}