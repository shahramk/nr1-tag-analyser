import React from 'react';
import PropTypes from 'prop-types';

import { Grid, GridItem, Stack, StackItem, HeadingText, Button, Spacing } from 'nr1';
import Entity from './Entity';
import MenuBar from './MenuBar/MenuBar';
import ComplianceScore from './ComplianceScore/ComplianceScore';
import PdfGenerator from './PdfGenerator';

const headerStyle = {
  backgroundColor: '#eee',
};

class Entities extends React.Component {
  state = {
    entities: this.props.tagHierarchy.entities,
    filteredEntities: this.props.tagHierarchy.entities,
    displayFilter: 'FULL',
    disableButtons: true,
    selectedAccounts: [],
    accountList: [],
    complianceItemStatus: {
      global: true,
      entityType: [],
    },
  };

  componentWillMount() {
    const accountList = this.getAccountListMultiSelect();
    const domainList = this.getEntityTypeList();

    const complianceItemStatus = {};
    complianceItemStatus.global = true;
    complianceItemStatus.entityType = [];
    domainList.forEach((domainName) => {
      complianceItemStatus.entityType.push({
        name: domainName,
        selected: false,
        active: true,
      });
    });

    this.setState({
      disableButtons: false,
      accountList: accountList,
      complianceItemStatus: complianceItemStatus,
    });
  }

  getAccountListMultiSelect() {
    const {
      tagHierarchy: { accountsList },
    } = this.props;
    const accountList = [];

    accountsList.forEach((account) => {
      accountList.push({
        key: accountList.length,
        value: `${account.id}: ${account.name}`,
        text: account.name,
      });
    });
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
    const { complianceItemStatus } = this.state;

    let e1 = [];
    switch (itemType) {
      case 'domain':
        // one domain
        e1 = entities.filter((entity) => entity.domain === itemName);
        break;
      default: // default to all
        e1 = entities;
        break;
    }

    const complianceSum = e1.reduce((acc, e) => acc + e.complianceScore, 0);

    const active =
      itemType === 'account'
        ? complianceItemStatus.global
        : complianceItemStatus.entityType.find(
          (domain) => domain.name === itemName
        ).active;

    // console.log(">> complianceSum: ", complianceSum)
    // console.log("result: ", complianceSum > 0.00 ?  parseFloat(complianceSum / e1.length).toFixed(2) : 0.00);

    return {
      type: itemType,
      name: itemName,
      entityCount: e1.length,
      active,
      score:
        complianceSum > 0.0
          ? parseFloat(complianceSum / e1.length).toFixed(2)
          : 0.0,
    };
  }

  getEntitiesByGuid = (entities, entityGuidList) => {
    return entities.filter((entity) => {
      if (entityGuidList.includes(entity.guid)) return entity;
    });
  };

  updateCurrentScope(selectedAccounts) {
    let updatedEntities = [];

    if (selectedAccounts.length === 0) {
      updatedEntities = this.props.tagHierarchy.entities;
    } else {
      let entityGuids = [];
      selectedAccounts.forEach((item) => {
        entityGuids = [
          ...entityGuids,
          ...this.props.tagHierarchy.accounts[
          item.split(':')[0]
          ],
        ];
      });
      updatedEntities = this.getEntitiesByGuid(
        this.props.tagHierarchy.entities,
        entityGuids
      );
    }

    return updatedEntities;
  }

  getFilteredEntities(entities, complianceItemStatus, displayFilter) {
    let filteredEntities;

    // filter displayed entities by entity types (if any)
    complianceItemStatus.entityType.forEach((et) => {
      if (et.selected) {
        entities = entities.filter((entity) => entity.domain === et.name);
      }
    });

    switch (displayFilter) {
      case 'FULL':
        filteredEntities = entities;
        break;

      case 'IN_COMPLIANCE':
        filteredEntities = entities.filter(
          (entity) => entity.complianceScore === 100
        );
        break;

      case 'OUT_OF_COMPLIANCE':
        filteredEntities = entities.filter(
          (entity) => entity.complianceScore !== 100
        );
        break;

      default:
        throw new Error(`invalid display filter: ${displayFilter}`);
    }

    return filteredEntities;
  }

  setEntityFilter(displayFilter) {
    const { entities, complianceItemStatus } = this.state;

    const filteredEntities = this.getFilteredEntities(
      entities,
      complianceItemStatus,
      displayFilter
    );

    this.setState({
      displayFilter: displayFilter,
      filteredEntities,
    });
  }

  getFiltersList() {
    const { complianceItemStatus, displayFilter } = this.state;
    const entityFilters = [];
    complianceItemStatus.entityType.forEach((et) => {
      if (et.selected) entityFilters.push(et.name);
    });
    if (['IN_COMPLIANCE', 'OUT_OF_COMPLIANCE'].includes(displayFilter)) {
      entityFilters.push(displayFilter);
    }
    return entityFilters.length ? entityFilters : ['None'];
  }

  onSelectEntityType = (itemType, itemName) => {
    const { entities, complianceItemStatus } = this.state;
    let { displayFilter } = this.state;

    switch (itemType) {
      case 'account':
        displayFilter = 'FULL';
        complianceItemStatus.global = true;
        complianceItemStatus.entityType.forEach((domain) => {
          domain.selected = false;
          domain.active = true;
        });

        break;

      case 'domain':
        const et = complianceItemStatus.entityType.find(
          (domain) => domain.name === itemName
        );

        if (et.selected) {
          // was selected - now being unselected
          complianceItemStatus.global = true;
          complianceItemStatus.entityType.forEach((domain) => {
            domain.selected = false;
            domain.active = true;
          });
        } else {
          complianceItemStatus.global = false;
          complianceItemStatus.entityType.forEach((domain) => {
            if (domain.name === itemName) {
              domain.selected = true;
              domain.active = true;
            } else {
              domain.selected = false;
              domain.active = false;
            }
          });
        }
        break;
    }

    const filteredEntities = this.getFilteredEntities(
      entities,
      complianceItemStatus,
      displayFilter
    );

    this.setState({
      complianceItemStatus,
      displayFilter,
      filteredEntities: filteredEntities,
    });
  }

  onSelectAccount = (data) => {
    const { complianceItemStatus, displayFilter } = this.state;
    const entities = this.updateCurrentScope(data.value);
    const filteredEntities = this.getFilteredEntities(
      entities,
      complianceItemStatus,
      displayFilter
    );
    this.setState({
      selectedAccounts: data.value,
      entities: entities,
      filteredEntities: filteredEntities,
    });
  }

  renderComplianceScore(entities, itemType, itemName) {
    const compliance = this.getCompliance(entities, itemType, itemName);

    return (
      <ComplianceScore
        key={itemName} 
        select={this.onSelectEntityType}
        compliance={compliance} />
    );
  }

  render() {
    const {
      entities,
      filteredEntities,
      disableButtons,
      accountList,
      selectedAccounts,
    } = this.state;

    return (
      <div className="container">
        <MenuBar accounts={accountList} change={this.onSelectAccount} />

        <div className="score__container">
          <div className="score__panel">
            <Stack>
              <StackItem columnSpan={12}>
                {this.renderComplianceScore(entities, 'account', 'account')}
              </StackItem>
              <StackItem>
                <Stack>
                  {Object.keys(this.props.tagHierarchy.entityTypes).map(
                    (domain) => {
                      return this.renderComplianceScore(
                        entities,
                        'domain',
                        domain
                      );
                    }
                  )}
                </Stack>
              </StackItem>
            </Stack>
          </div>
        </div>


        <Grid>
          <GridItem className="primary-content-container" columnSpan={12}>
            {' '}
            {/* sapcing */}
            <Spacing type={[Spacing.TYPE.SMALL]}>
              <div style={{ height: '10px' }} />
            </Spacing>
          </GridItem>
          <GridItem className="primary-content-container" columnSpan={4}>
            {' '}
            {/* 3 filter buttons */}
            <Button
              disabled={disableButtons}
              onClick={() => this.setEntityFilter('FULL')}
              type={Button.TYPE.NORMAL}
              iconType={Button.ICON_TYPE.INTERFACE__OPERATIONS__SHOW}
              sizeType={Button.SIZE_TYPE.SMALL}
            >
              All Entities
            </Button>
            <Button
              disabled={disableButtons}
              onClick={() => this.setEntityFilter('OUT_OF_COMPLIANCE')}
              type={Button.TYPE.NORMAL}
              iconType={Button.ICON_TYPE.INTERFACE__OPERATIONS__HIDE_OTHERS}
              sizeType={Button.SIZE_TYPE.SMALL}
            >
              Out of Compliance
            </Button>
            <Button
              disabled={disableButtons}
              onClick={() => this.setEntityFilter('IN_COMPLIANCE')}
              type={Button.TYPE.NORMAL}
              iconType={
                Button.ICON_TYPE.HARDWARE_AND_SOFTWARE__SOFTWARE__LIVE_VIEW
              }
              sizeType={Button.SIZE_TYPE.SMALL}
            >
              In Compliance
            </Button>
          </GridItem>
          <GridItem className="primary-content-container" columnSpan={2}>
            {' '}
            {/* heading: ientity count */}
            <HeadingText type={HeadingText.TYPE.HEADING_4}>
              <strong>Entity Count: ({filteredEntities.length})</strong>
            </HeadingText>
          </GridItem>
          <GridItem className="primary-content-container" columnSpan={2}>
            {' '}
            {/* heading: included accounts */}
            <HeadingText type={HeadingText.TYPE.HEADING_4}>
              <strong>
                Accounts: ({' '}
                {selectedAccounts.length > 0
                  ? selectedAccounts.join(', ')
                  : 'All Accounts'}{' '}
                )
              </strong>
            </HeadingText>
          </GridItem>
          <GridItem className="primary-content-container" columnSpan={2}>
            {' '}
            {/* heading: enabled filters */}
            <HeadingText type={HeadingText.TYPE.HEADING_4}>
              <strong>Filters: ({this.getFiltersList().join(', ')})</strong>
            </HeadingText>
          </GridItem>
          <GridItem className="primary-content-container" columnStart={12}>
            {' '}
            {/* PdfGeneraor */}
            <PdfGenerator
              data={filteredEntities.sort(function (a, b) {
                return a.account.id - b.account.id;
              })}
              accounts={
                selectedAccounts.length > 0
                  ? selectedAccounts.map((a) => a.split(':')[0]).join(', ')
                  : 'All Accounts'
              }
              filters={this.getFiltersList().join(', ')}
            />
          </GridItem>
          <GridItem className="primary-content-container" columnSpan={12}>
            {' '}
            {/* sapcing */}
            <Spacing type={[Spacing.TYPE.SMALL]}>
              <div style={{ maringTop: '1px' }} />
            </Spacing>
          </GridItem>
          <GridItem className="primary-content-container" columnSpan={12}>
            {' '}
            {/* table heading */}
            <>
              <table
                style={{
                  width: '99%',
                  // border: "2px",
                  backgroundColor: 'gray',
                  marginLeft: '8px',
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        width: '10%',
                        textAlign: 'center',
                        border: '3px solid black',
                        backgroundColor: 'gray',
                      }}
                    >
                      <HeadingText
                        style={{ headerStyle }}
                        type={HeadingText.TYPE.HEADING_3}
                      >
                        <strong>Account ID</strong>
                      </HeadingText>
                    </th>
                    <th
                      style={{
                        width: '8%',
                        textAlign: 'center',
                        border: '3px solid black',
                        backgroundColor: 'gray',
                      }}
                    >
                      <HeadingText
                        style={{ headerStyle }}
                        type={HeadingText.TYPE.HEADING_3}
                      >
                        <strong>Type</strong>
                      </HeadingText>
                    </th>
                    <th
                      style={{
                        width: '16%',
                        textAlign: 'center',
                        border: '3px solid black',
                        backgroundColor: 'gray',
                      }}
                    >
                      <HeadingText
                        style={{ headerStyle }}
                        type={HeadingText.TYPE.HEADING_3}
                      >
                        <strong>Name</strong>
                      </HeadingText>
                    </th>
                    <th
                      style={{
                        width: '4%',
                        textAlign: 'center',
                        border: '3px solid black',
                        backgroundColor: 'gray',
                      }}
                    >
                      <HeadingText
                        style={{ headerStyle }}
                        type={HeadingText.TYPE.HEADING_3}
                      >
                        <strong>Score</strong>
                      </HeadingText>
                    </th>
                    <th
                      style={{
                        width: '60%',
                        textAlign: 'center',
                        border: '3px solid black',
                        backgroundColor: 'gray',
                      }}
                    >
                      <HeadingText
                        style={{ headerStyle }}
                        type={HeadingText.TYPE.HEADING_3}
                      >
                        <strong>Entity Tags</strong>
                      </HeadingText>
                    </th>
                  </tr>
                </thead>
              </table>
            </>
          </GridItem>
          <GridItem
            className="primary-content-container"
            columnSpan={12}
            style={{ overflow: 'scroll' }}
          >
            {' '}
            {/* entities */}
            {filteredEntities.map((entity) => (
              <Entity key={entity.guid} entity={entity} />
            ))}
          </GridItem>
        </Grid>
      </div>
    );
  }
}

Entities.propTypes = {
  tagHierarchy: PropTypes.object.isRequired,
}

export default Entities;
