import React from "react";
import PropTypes from 'prop-types';
import { Icon, Input, Label, Button, Grid } from "semantic-ui-react";

export default class ComplianceBands extends React.Component {
    static propTypes = {
        complianceBands: PropTypes.object.isRequired,
        updateParentState: PropTypes.func.isRequired,
    }

    state = {
        complianceBands: this.props.complianceBands,
    }

    handleClick = (event, data, type) => {
        console.log(event, data, type);

        const { complianceBands } = this.state;
        switch (type) {
            case "highBandMin":
                complianceBands.highBand.lowerLimit = parseFloat(data.value).toFixed(2);
                this.setState({ complianceBands });
                break;

            case "midBandMin":
                complianceBands.midBand.lowerLimit = parseFloat(data.value).toFixed(2);
                this.setState({ complianceBands });
                break;

            case "midBandMax":
                complianceBands.midBand.upperLimit = parseFloat(data.value).toFixed(2);
                this.setState({ complianceBands });
                break;

            case "lowBandMax":
                complianceBands.lowBand.upperLimit = parseFloat(data.value).toFixed(2);
                this.setState({ complianceBands });
                break;

            case "saveComplianceBand":
                this.props.updateParentState(complianceBands);
                break;

            case "cancelComplianceBand":
                // reset bands
                this.setState({ complianceBands: this.props.complianceBands });
                break;

        }
    }

    render() {
        const { complianceBands } = this.state;

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
                            defaultValue={complianceBands.highBand.lowerLimit}
                            onChange={(event, data) => this.handleClick(event, data, "highBandMin")}
                        />
                        <label>&nbsp;%</label>
                        <br/>
                        </div>
                        
                        <div style={{border: "1px solid black", margin: "3px", padding: "5px"}}>
                        <label style={{padding: "20px"}}>Medium Band&nbsp;&nbsp;&nbsp;</label>
                        <Input 
                            style={{width: "50px", border: "1px solid lightgrey", padding: "2px"}}
                            defaultValue={complianceBands.midBand.lowerLimit}
                            onChange={(event, data) => this.handleClick(event, data, "midBandMin")}
                        />
                        <label>&nbsp;%&nbsp;&nbsp;to&nbsp;&nbsp;</label>
                        <Input 
                            style={{width: "50px", border: "1px solid lightgrey", padding: "2px"}}
                            defaultValue={complianceBands.midBand.upperLimit}
                            onChange={(event, data) => this.handleClick(event, data, "midBandMax")}
                        />
                        <label>&nbsp;%</label>
                        <br/>
                        </div>

                        <div style={{border: "1px solid black", margin: "3px", padding: "5px"}}>
                        <label style={{padding: "20px"}}>Low Band&nbsp;&nbsp;&nbsp;&lt;&nbsp;&nbsp;</label>
                        <Input 
                            style={{width: "50px", border: "1px solid lightgrey", padding: "2px"}}
                            defaultValue={complianceBands.lowBand.upperLimit}
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
                                onClick={(event, data) => this.handleClick(event, data, "saveComplianceBand")}
                            >
                                <Icon name="checkmark" /> Save
                            </Button>
                            <Button
                                floated='right'
                                color={"grey"}
                                onClick={(event, data) => this.handleClick(event, data, "cancelComplianceBand")}
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