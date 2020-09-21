import React, { Component } from "react";

import { Dropdown, DropdownItem, Grid, GridItem, HeadingText, Icon, Button } from "nr1";

import Entity from "./Entity";


class Entities extends Component {
  state = {
    accountScope: "Global", // valid: global, account
    entityTypeScope: "All", // valid: All, domain typer
    entities: this.props.tagHierarchy.entities,
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

  downloadReport(entities) {
    // download pdf with the confftents of displayed entities
    alert('download...')
  }
  render() {
    const { entities, accountScope, entityTypeScope } = this.state

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
          <></>
          {/* <div>
            <Icon
              style={{
                position: "absolute", right: "50px", padding: "10px", border: "3px solid #eee",
              }}
              type={Icon.TYPE.INTERFACE__OPERATIONS__CONFIGURE} />
            
          </div> */}
          
            <Button
              onClick={() => alert('Configuration...')}
              type={Button.TYPE.NORMAL}
              iconType={Button.ICON_TYPE.HARDWARE_AND_SOFTWARE__HARDWARE__SERVER__A_CONFIGURE}
              sizeType={Button.SIZE_TYPE.SMALL}
            >
              Setup
            </Button>
        </GridItem>
        <GridItem  className="primary-content-container" columnSpan={2}>
            <Button
              onClick={() => this.downloadReport(entities)}
              type={Button.TYPE.NORMAL}
              iconType={Button.ICON_TYPE.INTERFACE__OPERATIONS__DOWNLOAD}
              sizeType={Button.SIZE_TYPE.SMALL}
            >
              Download
            </Button>
          
        </GridItem>


        <GridItem className="primary-content-container" columnSpan={12}>
          {entities.map((entity) => (
            <Entity key={entity.guid} entity={entity} />
          ))}
        </GridItem>
      </Grid>
    );
  }

}

export default Entities;
