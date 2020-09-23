import React, { Component } from "react";

import { Dropdown, DropdownItem, Grid, GridItem, HeadingText, Icon, Button } from "nr1";

import Entity from "./Entity";

const color = {
  mandatory: {
    success: "seagreen",
    fail: "orangered",
  },
  optional: {
    success: "mediumseagreen",
    fail: "sandybrown",
  }
}
class Entities extends Component {
  state = {
    accountScope: "Global", // valid: global, account
    entityTypeScope: "All", // valid: All, domain typer
    entities: this.props.tagHierarchy.entities,
    disableDownload: true,
  };

  getAccountList() {
    const list = [];
    list.push("Global");
    this.props.tagHierarchy.entities.map((entity) => {
      if (list.indexOf(entity.account.id + " - " + entity.account.name) === -1)
        list.push(entity.account.id + " - " + entity.account.name);
    });
    return list;
  }

  getEntityTypeList() {
    const list = [];
    list.push("All");
    this.props.tagHierarchy.entities.map((entity) => {
      if (list.indexOf(entity.domain) === -1) list.push(entity.domain);
    });
    return list;
  }

  getEntities = (entities, entityGuidList) => {
    return entities.filter((entity, index, arr) => {
      if (entityGuidList.includes(entity.guid)) return entity;
    });
  };

  updateCurrentScope(scope, item) {
    let updatedEntities = [];
    const { entities, accountScope, entityTypeScope, getEntities } = this.state

    switch (scope) {

        case "account":
            // set scope to selected account or all accounts if "Global selected"
            updatedEntities = (item === "Global") 
            ? this.props.tagHierarchy.entities 
            : this.getEntities(this.props.tagHierarchy.entities, this.props.tagHierarchy.accounts[item.split(" ")[0]]);
            
            if (entityTypeScope !== "All") {
                updatedEntities = this.getEntities(updatedEntities, this.props.tagHierarchy.entityTypes[entityTypeScope]);
            }

            this.setState({ 
                entities: updatedEntities,
                accountScope: item,
            });

            break;

        case "entityType":
            // set scope to entity type (domain is used for entityType) or all types if "All" selescted
            updatedEntities = (item === "All")
            ? this.props.tagHierarchy.entities
            : this.getEntities(this.props.tagHierarchy.entities, this.props.tagHierarchy.entityTypes[item]);

            if (accountScope !== "Global") {
                updatedEntities = this.getEntities(updatedEntities, this.props.tagHierarchy.accounts[accountScope.split(" ")[0]]);
            }

            this.setState({
                entities: updatedEntities,
                entityTypeScope: item,
            });

            break;
        
        default:
            throw "invalid scope: " + scope;
    }
  }

  XXgetCompliance(entities, itemType, itemName) {
    Promise.resolve()
    .then((entities, itemType, itemName) => {
      switch(itemType) {
        case "account":
          if (itemName === "Global") {
            return entities;
          } else {
            // one account
            return entities.filter(entity => entity.account.id === itemName.split(" ")[0]);
          }
          break;

        case "domain":
          // one domain
          return entities.filter(entity => entity.domain === itemName);
          break;
      }

    })
    .then(currentEntities => {
      return {
        complianceSum: currentEntities.reduce((acc, e) => acc + e.complianceScore, 0),
        entities: currentEbtities,
      }
    })
    .then(result => {
      console.log(">> complianceSum: ", result.complianceSum);
      console.log("score: ", result.complianceSum > 0.00 ?  parseFloat(result.complianceSum / result.entities.length * 100).toFixed(2) : 0.00);
      return result.complianceSum > 0.00 ?  parseFloat(result.complianceSum / result.entities.length * 100).toFixed(2) : 0.00;
    });
  }




  getCompliance(entities, itemType, itemName) {
    // all accounts
    let e1 = [];

    switch(itemType) {
        case "account":
          if (itemName === "Global") {
            e1 = entities;
          } else {
            // one account
            e1 = entities.filter(entity => entity.account.id === itemName.split(" ")[0]);
          }
          break;

        case "domain":
          // one domain
          e1 = entities.filter(entity => entity.domain === itemName);
          break;

        // default: throw "Error - invalid compliance item type"
    }

    const complianceSum = e1.reduce((acc, e) => acc + e.complianceScore, 0);
    console.log(">> complianceSum: ", complianceSum)
    console.log("result: ", complianceSum > 0.00 ?  parseFloat(complianceSum / e1.length * 100).toFixed(2) : 0.00);
    return {
      entityCount: e1.length,
      complianceScorePercent: complianceSum > 0.00 ?  parseFloat(complianceSum / e1.length * 100).toFixed(2) : 0.00,
    }
  }

  addComplianceScore(entities, itemType, itemName) {

    const result = this.getCompliance(entities, itemType, itemName);
    
    let color = "";
    if (result.complianceScorePercent >= 90)
      color = "seagreen";
    else if (result.complianceScorePercent > 70)
      color = "sandybrown";
    else
      color = "orangered";

    const boxHeading = itemName === "Global" ? "Overall Compliance" : itemName;
    const boxSize = itemType === "domain" ? "150px" : "230px"
    const boxStyle = {
      border: "5px solid " + color,
      borderRadius: "10px",
      padding: "5px 5px",
      margin: "20px",
      fontSize: "16px",
      fontFamily: "Comic Sans MS",
      textAlign: "center",
      // display: "flex",
      // margin: "7px 4px",
      height: boxSize,
      width: boxSize,
    };
    const boxKey = "score_" + itemName;

    return (
      <div style={boxStyle}
      key={boxKey}
      >
        <label><strong>{boxHeading}</strong></label>
        <br/><br/><br/>
        <label><strong>Entity Count ({result.entityCount})</strong></label>
        <br/><br/>
        <label style={{fontSize: "28px", color: color}}>
          {parseFloat(result.complianceScorePercent) + "%"}
        </label>

      </div>
    )
  }

  downloadReport(entities) {
    // download pdf with the confftents of displayed entities
    alert('download...')
  }

  componentDidMount() {
    this.setState( { disableDownload: false })
  }

  render() {
    const { entities, accountScope, entityTypeScope, disableDownload } = this.state

    return (
      <Grid className="primary-grid">
        <GridItem className="primary-content-container" columnSpan={2}>
          <h1>Entities</h1>
        </GridItem>
        <GridItem className="primary-content-container" columnSpan={2}>
          <HeadingText type={HeadingText.TYPE.HEADING_4}>Accounts</HeadingText>
          <Dropdown
            title={accountScope}
            items={this.getAccountList()}
            style={{
              display: "inline-block",
              margin: "0 .5em",
              verticalAlign: "middle",
              backgroundColor: "green",
            }}
          >
            {({ item, index }) => (
              <DropdownItem
                key={`d-${index}`}
                onClick={(evt) => this.updateCurrentScope("account", item)}
              >
                {item}
              </DropdownItem>
            )}
          </Dropdown>
        </GridItem>
        <GridItem className="primary-content-container" columnSpan={2}>
          <HeadingText type={HeadingText.TYPE.HEADING_4}>Entity Types</HeadingText>
            <Dropdown
              title={entityTypeScope}
              // items={this.props.tagHierarchy.entityTypes}
              items={this.getEntityTypeList()}
              style={{
                display: "inline-block",
                margin: "0 .5em",
                verticalAlign: "middle",
              }}
            >
              {({ item, index }) => (
                <DropdownItem
                  key={`d-${index}`}
                  onClick={(evt) => this.updateCurrentScope("entityType", item)}
                >
                  {item}
                </DropdownItem>
              )}
            </Dropdown>
          
        </GridItem>
        <GridItem className="primary-content-container" columnSpan={3}>
          <></>
        </GridItem>
        <GridItem className="primary-content-container" columnSpan={1}>
          <Button
            onClick={() => alert('Configuration...')}
            type={Button.TYPE.NORMAL}
            iconType={Button.ICON_TYPE.HARDWARE_AND_SOFTWARE__HARDWARE__SERVER__A_CONFIGURE}
            sizeType={Button.SIZE_TYPE.SMALL}
          >
            Setup
          </Button>
        </GridItem>
        <GridItem className="primary-content-container" columnSpan={2}>
                
          <Button
            disabled={disableDownload}
            onClick={() => this.downloadReport(entities)}
            type={Button.TYPE.NORMAL}
            iconType={Button.ICON_TYPE.INTERFACE__OPERATIONS__DOWNLOAD}
            sizeType={Button.SIZE_TYPE.SMALL}
          >
            Download
          </Button>
          
        </GridItem>




        <GridItem className="primary-content-container" columnSpan={12}>
          <div className="split">
            
            <div className="left">
              <h2>Global Score</h2>
              <div 
              style={{
                height: "420px",
                border: "5px solid #ccc",
                borderRadius: "10px",
                padding: "10px 10px",
                margin: "10px",
              }}
              >
                {this.addComplianceScore(entities, "account", accountScope)}
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




        <GridItem className="primary-content-container" columnSpan={12} style={{overflow: "scroll"}}>
          {entities.map((entity) => (
            <Entity key={entity.guid} entity={entity} />
          ))}
        </GridItem>
      </Grid>
    );
  }

}

export default Entities;
