import React, { Component } from "react";

import { Grid, GridItem, HeadingText, Button, Spacing, Icon, Link } from "nr1";
import { Menu, Dropdown, Checkbox } from 'semantic-ui-react';

import Entity from "./Entity";
import { setComplianceColor } from "../utils/tag-schema";
import PdfGenerator from "./PdfGenerator"


const headerStyle = {
  backgroundColor: "#eee",

};

class Entities extends Component {

  state = {
    entities: this.props.tagHierarchy.entities,
    filteredEntities: this.props.tagHierarchy.entities,
    displayFilter: "FULL",
    disableButtons: true,
    selectedAccounts: [],
    accountList: [],
    complianceItemStatus: {
      global: true,
      entityType: [],
    }
  };

  getAccountListMultiSelect() {
    const accountList = [];
    this.props.tagHierarchy.accountsList.forEach(account => {
      accountList.push({key: accountList.length, value: account.id + ": " + account.name, text: account.name});
    })
    return accountList;
  }

  getEntityTypeList() {
    const list = [];
    this.props.tagHierarchy.entities.map((entity) => {
      if (list.indexOf(entity.domain) === -1) list.push(entity.domain);
    });
    return list;
  }

  getCompliance(entities, itemType, itemName) {
    // all accounts
    let e1 = [];

    switch(itemType) {
        case "account":
          e1 = entities;
          break;

        case "domain":
          // one domain
          e1 = entities.filter(entity => entity.domain === itemName);
          break;

        // default: throw "Error - invalid compliance item type"
    }

    const complianceSum = e1.reduce((acc, e) => acc + e.complianceScore, 0);
    // console.log(">> complianceSum: ", complianceSum)
    // console.log("result: ", complianceSum > 0.00 ?  parseFloat(complianceSum / e1.length).toFixed(2) : 0.00);
    return {
      entityCount: e1.length,
      complianceScorePercent: complianceSum > 0.00 ?  parseFloat(complianceSum / e1.length).toFixed(2) : 0.00,
    }
  }

  setComplianceBackgroundColor(itemType, itemName) {
    const { complianceItemStatus } = this.state;
    const item =  itemType === "account" 
    ? complianceItemStatus.global
    : complianceItemStatus.entityType.find(domain => domain.name === itemName).active;

    return item ? "white" : "lightgray";
  }

  setComplianceFilterStatus(itemType, itemName) {
      // console.log(">>> " + itemName + " compliance score clicked")

      const { entities, complianceItemStatus } = this.state;
      let { displayFilter } = this.state;

      // add displayFilter = "FULL" when overall compliance is selected - so uncommented this if stmt
      // if (itemType === "account" && complianceItemStatus.global)
      //   return; // clicking on active "overall compliance" widget 
      
      switch(itemType) {
        case "account":
          displayFilter = "FULL";
          complianceItemStatus.global = true;
          complianceItemStatus.entityType.forEach(domain => {
            domain.selected = false;
            domain.active = true;
          })
            
          break;

        case "domain":
          const et = complianceItemStatus.entityType.find(domain => domain.name === itemName);

          if (et.selected) { // was selected - now being unselected
            complianceItemStatus.global = true;
            complianceItemStatus.entityType.forEach(domain => {
              domain.selected = false;
              domain.active = true;
            })
          }
          else {
            complianceItemStatus.global = false;
            complianceItemStatus.entityType.forEach(domain => {
              if (domain.name === itemName) {
                domain.selected = true;
                domain.active = true;
              }
              else {
                domain.selected = false;
                domain.active = false;
              }
            })
          }
          break;
      }

      const filteredEntities = this.getFilteredEntities(entities, complianceItemStatus, displayFilter);

      this.setState({ 
        complianceItemStatus,
        displayFilter,
        filteredEntities: filteredEntities,
      });
  }

  addComplianceScore(entities, itemType, itemName) {

    const result = this.getCompliance(entities, itemType, itemName);
    
    const color = setComplianceColor(result.complianceScorePercent);

    const boxHeading = itemType === "account" ? "Overall Compliance" : itemName;
    const boxSize = itemType === "domain" ? "160px" : "270px"
    const boxStyle = {
      border: "3px solid black",
      borderRadius: "10px",
      padding: "5px 5px",
      margin: "5px",
      fontSize: "16px",
      fontFamily: "Comic Sans MS",
      textAlign: "center",
      height: boxSize,
      width: boxSize,
      backgroundColor: this.setComplianceBackgroundColor(itemType, itemName)
    };
    const boxKey = "score_" + itemName;

    return (
      <div style={boxStyle}
      key={boxKey}
      onClick={() => this.setComplianceFilterStatus(itemType, itemName)}
      >
        <label><strong>{boxHeading}</strong></label>
        <br/><br/>
        {itemType === "domain" ? null : <br/>}
        <label><strong>Entity Count ({result.entityCount})</strong></label>
        <br/><br/>
        {itemType === "domain" ? null : <br/>}
        <label style={{fontSize: itemType === "domain" ? "28px" : "36px", color: color}}>
          {parseFloat(result.complianceScorePercent) + "%"}
        </label>

      </div>
    )
  }

  getEntitiesByGuid = (entities, entityGuidList) => {
    return entities.filter((entity, index, arr) => {
      if (entityGuidList.includes(entity.guid)) return entity;
    });
  };

  updateCurrentScope(scope, selectedAccounts) {
    let updatedEntities = [];
    const { entities, getEntitiesByGuid } = this.state

    if (selectedAccounts.length === 0) {
      updatedEntities = this.props.tagHierarchy.entities;
    } else {
      let entityGuids = [];
      var item;
      for (item in selectedAccounts) {
        entityGuids = [...entityGuids, ...this.props.tagHierarchy.accounts[selectedAccounts[item].split(":")[0]]];
      }
      updatedEntities = this.getEntitiesByGuid(this.props.tagHierarchy.entities, entityGuids);
    }
    
    return updatedEntities;
}

  getFilteredEntities(entities, complianceItemStatus, displayFilter) {

    let filteredEntities;

    // filter displayed entities by entity types (if any)
    complianceItemStatus.entityType.forEach(et => {
      if (et.selected) {
        entities = entities.filter(entity => entity.domain === et.name);
      }
    });

    switch(displayFilter) {
      case "FULL":
        filteredEntities = entities;
        break;

      case "IN_COMPLIANCE":
        filteredEntities = entities.filter(entity => entity.complianceScore === 100);
        break;

      case "OUT_OF_COMPLIANCE":
        filteredEntities = entities.filter(entity => entity.complianceScore !== 100)
        break;

      default: 
        throw "invalid display filter: " + displayFilter;
    }
    
    return filteredEntities;
  }

  setEntityFilter(displayFilter) {
    const { entities, complianceItemStatus } = this.state;

    const filteredEntities = this.getFilteredEntities(entities, complianceItemStatus, displayFilter);

    this.setState({ 
      displayFilter: displayFilter,
      filteredEntities,
    });
  }

  getFiltersList() {
    const { complianceItemStatus, displayFilter } = this.state;
    const entityFilters = [];
    complianceItemStatus.entityType.forEach(et => { 
      if (et.selected) entityFilters.push(et.name);
    });
    if (["IN_COMPLIANCE", "OUT_OF_COMPLIANCE"].includes(displayFilter)) {
      entityFilters.push(displayFilter);
    }
    return entityFilters.length ? entityFilters : ["None"];
  }

  componentWillMount() {
    const accountList = this.getAccountListMultiSelect();
    const domainList = this.getEntityTypeList();

    const complianceItemStatus = {};
    complianceItemStatus["global"] = true;
    complianceItemStatus.entityType = [];
    domainList.forEach(domainName => {
      complianceItemStatus.entityType.push({
        name: domainName,
        selected: false,
        active: true,
      });
    });

    this.setState( { 
      disableButtons: false, 
      accountList: accountList ,
      complianceItemStatus: complianceItemStatus,
    })

  }

  componentDidCatch(error, errorInfo) {
    // console.log(error, errorInfo);
  }

  handleDropdownChange(event, data, type) {
    const { complianceItemStatus, displayFilter } = this.state;
    const entities = this.updateCurrentScope("account", data.value);
    const filteredEntities = this.getFilteredEntities(entities, complianceItemStatus, displayFilter);
    this.setState({ 
      selectedAccounts: data.value,
      entities: entities,
      filteredEntities: filteredEntities,
    });
  }
  
  render() {
    const { entities, filteredEntities, disableButtons, accountList, selectedAccounts } = this.state

    return (
      <div>

        <div style={{height: 120, paddingLeft: 20, paddingRight: 20}}>
          <h1>Tag Analysis</h1>
          <hr></hr>
          <br/>

          <div style={{float: "left"}}> {/* account multi-select dropdown */}
            <div style={{width: "500px", border: "1px solid black"}}>
              <Menu inverted={false} className="menu-bar">
                <Dropdown
                    className="ui multiple selection dropdown"
                    placeholder='Select Accounts'
                    options={accountList}
                    simple
                    clearable
                    fluid 
                    multiple 
                    search
                    selection
                    scrolling
                    onChange={(event, data) => {
                        this.handleDropdownChange(event, data, 'sortBy');
                    }}
                    />
              </Menu>
            </div>
          </div>

          <div style={{float: "right", paddingRight: 5}}> {/* setup button */}
            <Button
              onClick={() => alert('Configuration...')}
              type={Button.TYPE.NORMAL}
              iconType={Button.ICON_TYPE.HARDWARE_AND_SOFTWARE__HARDWARE__SERVER__A_CONFIGURE}
              sizeType={Button.SIZE_TYPE.SMALL}
            >
              Setup
            </Button>
          </div>
        </div>

        <Grid className="primary-grid">
          <GridItem className="primary-content-container" columnSpan={12}> {/* compliance scores */}
            <div className="split">
              
              <div className="left">
                <h2>Global Score</h2>
                <div 
                style={{
                  height: "370px",
                  border: "5px solid #ccc",
                  borderRadius: "10px",
                  padding: "10px 10px",
                  margin: "10px",
                }}
                >
                  {this.addComplianceScore(entities, "account", "account")}
                </div>
              </div>

              <div className="right">
                <h2>Entity Type Score</h2>
                <div 
                style={{
                  width: "700px",
                  border: "5px solid #ccc",
                  borderRadius: "10px",
                  padding: "10px 10px",
                  margin: "10px",
                  display: "flex",
                  flexFlow: "row wrap",
                }}
                >
                  {Object.keys(this.props.tagHierarchy.entityTypes).map(domain => {
                    return this.addComplianceScore(entities, "domain", domain)
                  })}
                </div>
              </div>
            </div>
          </GridItem>
          <GridItem className="primary-content-container" columnSpan={12}> {/* sapcing */}
            <Spacing type={[Spacing.TYPE.SMALL]}>
              <div style={{height: "10px"}}></div>
            </Spacing>
          </GridItem>
          <GridItem className="primary-content-container" columnSpan={4}> {/* 3 filter buttons */}
            <Button
              disabled={disableButtons}
              onClick={() => this.setEntityFilter("FULL")}
              type={Button.TYPE.NORMAL}
              iconType={Button.ICON_TYPE.INTERFACE__OPERATIONS__SHOW}
              sizeType={Button.SIZE_TYPE.SMALL}
            >
              All Entities
            </Button>
                      
            <Button
              disabled={disableButtons}
              onClick={() => this.setEntityFilter("OUT_OF_COMPLIANCE")}
              type={Button.TYPE.NORMAL}
              iconType={Button.ICON_TYPE.INTERFACE__OPERATIONS__HIDE_OTHERS}
              sizeType={Button.SIZE_TYPE.SMALL}
            >
              Out of Compliance
            </Button>

            <Button
              disabled={disableButtons}
              onClick={() => this.setEntityFilter("IN_COMPLIANCE")}
              type={Button.TYPE.NORMAL}
              iconType={Button.ICON_TYPE.HARDWARE_AND_SOFTWARE__SOFTWARE__LIVE_VIEW}
              sizeType={Button.SIZE_TYPE.SMALL}
            >
              In Compliance
            </Button>
          </GridItem>
          <GridItem className="primary-content-container" columnSpan={2}> {/* heading: ientity count */}
            <HeadingText type={HeadingText.TYPE.HEADING_4}><strong>Entity Count: ({filteredEntities.length})</strong></HeadingText>
          </GridItem>
          <GridItem className="primary-content-container" columnSpan={2}> {/* heading: included accounts */}
            <HeadingText type={HeadingText.TYPE.HEADING_4}><strong>Accounts: ( {selectedAccounts.length > 0 ? selectedAccounts.join(", ") : "All Accounts"} )</strong></HeadingText>
          </GridItem>
          <GridItem className="primary-content-container" columnSpan={2}> {/* heading: enabled filters */}
            <HeadingText type={HeadingText.TYPE.HEADING_4}><strong>Filters: ({this.getFiltersList().join(", ")})</strong></HeadingText>
          </GridItem>
          <GridItem className="primary-content-container" columnStart={12}> {/* PdfGeneraor */}
            <PdfGenerator 
              data={filteredEntities.sort(function(a, b) {return a.account.id - b.account.id;}) }
              accounts={selectedAccounts.length > 0 ? selectedAccounts.map(a => a.split(":")[0]).join(", ") : "All Accounts"} 
              filters={this.getFiltersList().join(", ")}
            />
          </GridItem>
          <GridItem className="primary-content-container" columnSpan={12}> {/* sapcing */}
            <Spacing type={[Spacing.TYPE.SMALL]}>
              <div style={{maringTop: "1px"}}></div>
            </Spacing>
          </GridItem>
          <GridItem className="primary-content-container" columnSpan={12}> {/* table heading */}
            <>
              <table 
                style={{
                  width: "99%",
                  // border: "2px", 
                  backgroundColor: "gray",
                  marginLeft: "8px",
                }}>
                <thead>
                  <tr>
                    <th style={{width: "10%", textAlign: "center", border: "3px solid black", backgroundColor: "gray"}}>
                      <HeadingText style={{headerStyle}} type={HeadingText.TYPE.HEADING_3}><strong>Account ID</strong></HeadingText>
                    </th>
                    <th style={{width: "8%", textAlign: "center", border: "3px solid black", backgroundColor: "gray"}}>
                      <HeadingText style={{headerStyle}} type={HeadingText.TYPE.HEADING_3}><strong>Type</strong></HeadingText>
                    </th>
                    <th style={{width: "16%", textAlign: "center", border: "3px solid black", backgroundColor: "gray"}}>
                      <HeadingText style={{headerStyle}} type={HeadingText.TYPE.HEADING_3}><strong>Name</strong></HeadingText>
                    </th>
                    <th style={{width: "4%", textAlign: "center", border: "3px solid black", backgroundColor: "gray"}}>
                      <HeadingText style={{headerStyle}} type={HeadingText.TYPE.HEADING_3}><strong>Score</strong></HeadingText>
                    </th>
                    <th style={{width: "60%", textAlign: "center", border: "3px solid black", backgroundColor: "gray"}}>
                      <HeadingText style={{headerStyle}} type={HeadingText.TYPE.HEADING_3}><strong>Entity Tags</strong></HeadingText>
                    </th>
                  </tr>
                </thead>
              </table>
            </>
          </GridItem>
          <GridItem className="primary-content-container" columnSpan={12} style={{overflow: "scroll"}}> {/* entities */}
            {filteredEntities.map((entity) => (
              <Entity key={entity.guid} entity={entity} />
            ))}
          </GridItem>
        </Grid>
      </div>
    );
  }

}

export default Entities;
