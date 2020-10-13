import React from "react";
import PropTypes from 'prop-types';
import { Icon, Input, Label, Button, Grid, } from "semantic-ui-react";

export default class ComplianceBands extends React.Component {
    static propTypes = {
        handleDropdownChange: PropTypes.func,
        handleClick: PropTypes.func,
    }

    state = {
        value: null,
        selectedTemplate: null,
    }

    // handleClick = (event, data, type) => {
    //     console.log(event, data);

    //     switch (type) {
    //         case "highBandMin":

    //             break;

    //         case "midBandMin":

    //             break;

    //         case "midBandMax":

    //             break;

    //         case "lowBandMax":

    //             break;

    //         case "saveTemplate":

    //             break;

    //         case "cancelTemplate":

    //             break;

    //     }
    // }

    render() {

        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column style={{height: "100px"}} width={16}>
                        <></>
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                    <Grid.Column style={{height: "300px"}} width={4}>
                        <></>
                    </Grid.Column>
                    <Grid.Column style={{height: "300px", border: "3px solid black", padding: "20px"}} width={5}>
                        <center><Label style={{backgroundColor: "lightgrey", fontSize: "20px"}}>Compliance Bands</Label></center>
                        <br/>

                        <div style={{border: "1px solid black", margin: "3px", padding: "5px"}}>
                        <label style={{padding: "20px"}}>High Band&nbsp;&nbsp;&nbsp;&gt;=&nbsp;&nbsp;</label>
                        <Input 
                            style={{width: "50px", border: "1px solid lightgrey", padding: "2px", textAlign: "right"}}
                            onChange={(event, data) => this.handleClick(event, data, "highBandMin")}
                        />
                        <label>&nbsp;%</label>
                        <br/>
                        </div>
                        
                        <div style={{border: "1px solid black", margin: "3px", padding: "5px"}}>
                        <label style={{padding: "20px"}}>Medium Band&nbsp;&nbsp;&nbsp;</label>
                        <Input 
                            style={{width: "50px", border: "1px solid lightgrey", padding: "2px"}}
                            onChange={(event, data) => this.handleClick(event, data, "midBandMin")}
                        />
                        <label>&nbsp;%&nbsp;&nbsp;to&nbsp;&nbsp;</label>
                        <Input 
                            style={{width: "50px", border: "1px solid lightgrey", padding: "2px"}}
                            onChange={(event, data) => this.handleClick(event, data, "midBandMax")}
                        />
                        <label>&nbsp;%</label>
                        <br/>
                        </div>

                        <div style={{border: "1px solid black", margin: "3px", padding: "5px"}}>
                        <label style={{padding: "20px"}}>Low Band&nbsp;&nbsp;&nbsp;&lt;&nbsp;&nbsp;</label>
                        <Input 
                            style={{width: "50px", border: "1px solid lightgrey", padding: "2px"}}
                            onChange={(event, data) => this.handleClick(event, data, "lowBandMax")}
                        />
                        <label>&nbsp;%</label>
                        <br/>
                        </div>
                        <div>
                            <br/>
                            <Button
                                floated='right'
                                color={"blue"}
                                onClick={(event, data) => this.handleClick(event, data, "saveTemplate")}
                            >
                                <Icon name="checkmark" /> Save
                            </Button>
                            <Button
                                floated='right'
                                color={"grey"}
                                onClick={(event, data) => this.handleClick(event, data, "cancelTemplate")}
                            >
                                <Icon name="arrow alternate circle left outline" /> Cancel
                            </Button>
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}