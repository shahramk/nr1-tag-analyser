import React from 'react';
import PropTypes from 'prop-types';

import { Spinner, Stack, StackItem, navigation, NerdletStateContext } from 'nr1';

import { complianceBands } from '../../shared/utils/tag-schema';
import MenuBar from './MenuBar/MenuBar';
import ComplianceScore from './ComplianceScore/ComplianceScore';
import EntityHeader from './EntityTable/EntityHeader';
import EntityTable from './EntityTable/EntityTable';
// import Configuration from "../../config"
import { getAccountCollection, writeAccountDocument, getDate } from "../../shared/utils/helpers"
import Modal from './Modal/Modal';
import Config from './Config/Config';

class Entities extends React.Component {
  state = {
    loading: true,
    entities: this.props.tagHierarchy.entities,
    filteredEntities: this.props.tagHierarchy.entities,
    displayFilter: 'FULL',
    selectedAccounts: [],
    accountList: [],
    complianceItemStatus: {
      global: true,
      entityType: [],
    },
    showConfigModal: false,
  };

  constructor(props) {
    super(props);

    this.userAccount = this.props.userAccount;
    this.user = this.props.user;
    this.nerdStoreCollection = "tagAnalyserCollection";
    this.nerdStoreDocument = "tagAnalyserDocument";
    // this.nerdStoreConfigData = {};

    this.updateStateBind = this.updateState.bind(this);
  };

  updateState = (prop) => {
    console.log(prop);
  }

  componentDidMount() {
    const accountList = this.getAccountListMultiSelect();
    const domainList = this.getEntityTypeList();
    // const nerdstoreConfigData = this.getNerdStoreConfigData(accountList, domainList);

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
      // nerdstoreConfigData: nerdstoreConfigData,
      loading: false,
    });
  }

  openConfig = () => this.setState({ showConfigModal: true });

  closeConfig = () => this.setState({ showConfigModal: false });

  getAccountListMultiSelect() {
    const {
      tagHierarchy: { accountList },
    } = this.props;
    // const accountList = [];

    // accountList.forEach((account) => {
    //   accountList.push({
    //     key: accountList.length,
    //     value: `${account.id}: ${account.name}`,
    //     text: account.name,
    //   });
    // });
    return accountList;
  }

  getEntityTypeList() {
    const list = [];
    this.props.tagHierarchy.entities.map((entity) => {
      if (list.indexOf(entity.domain) === -1) list.push(entity.domain);
    });
    return list;
  }

  getComplianceBand = (score) => {
    if (score >= complianceBands.highBand.lowerLimit) return 'high__band';
    else if (
      complianceBands.midBand.lowerLimit <= score &&
      score < complianceBands.midBand.upperLimit
    )
      return 'mid__band';
    else return 'low__band';
  };

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
    const score = complianceSum > 0.0
      ? parseFloat(complianceSum / e1.length).toFixed(2)
      : 0.0;
    const band = this.getComplianceBand(score)
    const active =
      itemType === 'account'
        ? complianceItemStatus.global
        : complianceItemStatus.entityType.find(
          (domain) => domain.name === itemName
        ).active;

    return {
      type: itemType,
      name: itemName,
      entityCount: e1.length,
      active,
      score,
      band,
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
          ...this.props.tagHierarchy.accounts[item.split(':')[0]],
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
  };

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
  };

  onFilterEntityTable = (displayFilter) => {
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
      loading,
      entities,
      filteredEntities,
      accountList,
      selectedAccounts,
      showConfigModal,
    } = this.state;
    const { user, userAccount } = this.props;

    const modalStyle = { width: '90%', height: '90%' };

    return (loading ?
        <Spinner />
      :
      <div className="container">
        <MenuBar accounts={accountList} change={this.onSelectAccount} openConfig={this.openConfig} />

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

        <div className="table__container">
          <EntityHeader
            filter={this.onFilterEntityTable}
            count={filteredEntities.length}
            accounts={
              selectedAccounts.length > 0 ? selectedAccounts.join(', ') : ''
            }
            entityType={this.getFiltersList().join(', ')}
            entities={filteredEntities.sort(function (a, b) {
              return a.account.id - b.account.id;
            })}
          />
          <EntityTable entities={filteredEntities} />
        </div>
        {showConfigModal ? (
          <Modal style={modalStyle} onClose={this.closeConfig}>
            <Config accounts={accountList} user={user} userAccount={userAccount} onUpdate={data => console.log(data)} />
          </Modal>
        ): null}
      </div>
    );
  }
}

Entities.propTypes = {
  tagHierarchy: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  userAccount: PropTypes.number.isRequired,
};

export default Entities;
