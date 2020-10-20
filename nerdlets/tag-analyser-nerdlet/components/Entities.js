import React from 'react';
import PropTypes from 'prop-types';

import { Spinner, Stack, StackItem, AccountStorageQuery, AccountStorageMutation } from 'nr1';

import MenuBar from './MenuBar/MenuBar';
import ComplianceScore from './ComplianceScore/ComplianceScore';
import EntityHeader from './EntityTable/EntityHeader';
import EntityTable from './EntityTable/EntityTable';
import helpers from  "../../shared/utils/helpers"
import Modal from './Modal/Modal';
import Config from './Config/Config';
import utils from './Config/utils';

class Entities extends React.Component {
  state = {
    loading: true,
    entities: this.props.nerdGraphEntityData.entities,
    filteredEntities: this.props.nerdGraphEntityData.entities,
    nerdStoreConfigData: {}, // this.props.nerdStoreConfigData,
    displayFilter: 'FULL',
    selectedAccounts: [],
    selectedTemplates: [],
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
  };

  updateState = (data) => {
    console.log(">>> Entities.updateState: ", data);
    this.loadNerdStoreData();
  }

  fetchConfig = async () => {
    const { userAccount } = this.props;

    const config = await AccountStorageQuery.query({
      accountId: userAccount,
      collection: helpers.nerdStoreInfo.collectionName, // 'tag-analyser',
      documentId: helpers.nerdStoreInfo.documentName,   // 'config',
    });

    const result = (config || {}).data;
    console.log(">>> Entities.fetchConfig: ", result);

    return result;
  };

  updateConfig = async (type, updatedData) => {
    const { nerdStoreConfigData } = this.state;
    const { userAccount } = this.props;

    const newData = utils.deepCopy(nerdStoreConfigData);
    newData[type] = updatedData;
    await AccountStorageMutation.mutate({
      accountId: userAccount,
      actionType: AccountStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
      collection: helpers.nerdStoreInfo.collectionName, // 'tag-analyser',
      documentId: helpers.nerdStoreInfo.documentName,   // 'config',
      document: newData,
    });
  };

  getConfigFromNerdStore = async () => {
    const data = await this.fetchConfig();
    // console.log("Entities:getConfigFromNerdStore:data: ", data);
    const templateList = data.templates.length ?
      data.templates.filter(template => template.enabled).map((template, index) => ({
          id: index,
          key: template.name,
          text: template.name,
          value: template.name,
      }))
    :
      [];
    
    return {
      templates: data.templates,
      selectedTempaltes: data.selectedTemplates ? data.selectedTemplates : [],
      selectedAccounts: data.selectedAccounts ? data.selectedAccounts : [],
      templateList, 
      complianceBands: data.complianceBands, // || helpers.defaultComplianceBands, 
      entityTypes: data.entityTypes, // || Object.keys(this.props.nerdGraphEntityData.entityTypes),
    };
  }

  setEntitiesTagStatus = (entities, activeTags) => {
    // console.log("@@>>> activeTags: ", activeTags);
    entities.forEach(entity => {
      entity.mandatoryTags = [];
      entity.optionalTags = [];
      let compliance = 0;
      const mandatoryTagCount = activeTags.filter(activeTag => activeTag.mandatory).length;
      activeTags.forEach(activeTag => {
        const t = entity.tags.find(tag => tag.tagKey === activeTag.name)
        if (typeof(t) === "object") {
          if (activeTag.mandatory) {
            entity.mandatoryTags.push(t);
            compliance += 1;
          }
          else {
            entity.optionalTags.push(t);
          }
        }
        else {
          if (activeTag.mandatory) {
            entity.mandatoryTags.push({ tagKey: activeTag.name, tagValues: ["<undefined>"]});
          }
          else {
            entity.optionalTags.push({ tagKey: activeTag.name, tagValues: ["<undefined>"]});
          }
        }
      });
      entity.complianceScore = compliance / mandatoryTagCount * 100;
    });
    return entities;
  }

  sortTagsUnique(tags) {
    // sort tags
    const t5 = tags.sort(function(a, b) {
      if (a.name > b.name) {
        return 1;
      } else if (a.name === b.name) {
          if (a.mandatory) {
            return -1;
          } else if (a.mandatory === b.mandatory) {
            return 0;
          } else {
            return 1;
          }
      } else {
        return -1;
      }
    });

    // make the list unique - mandatory comes before option - so pick the first occurence when duplicate
    const t5_unique = [];
    let prevTag = {};
    for (var i=0; i< t5.length; i++) {
          if (prevTag === {} || t5[i].name !== prevTag.name) {
            t5_unique.push(t5[i]);
            prevTag = t5[i];
          }
    }
    return t5_unique;
  }

  inArray = (list, value) => {
    for (var key of list) if(value === key) return true;
    return false;
  }

  filterEntitiesByDomains = (entities, domains) => {
    return entities.filter(entity => this.inArray(domains, entity.domain));
  }

  updateActiveTemplatesDetails = (selectedTemplates) => {
    const { nerdStoreConfigData } = this.state;
    let scope = "account"; // if at least one "global" template selected, set scope of selected templates to "global"
    let accounts = [];
    let tags = [];

    selectedTemplates.forEach(templateName => {
      const t = nerdStoreConfigData.templates.find(template => template.name === templateName);
      if (t) {
        if (t.scope === "account") {
          accounts = [ ...accounts, ...(t.accounts) ];
        }
        if (t.scope === "global") {
          scope = "global";
        }

        tags = [ ...tags, ...(t.tags) ];
      }
    });

    const sortedUniqueTags = this.sortTagsUnique(tags);
    return {
      scope,
      accounts: scope === "global" ? [] : [...new Set(accounts)].sort(),
      tags: sortedUniqueTags,
    };
  }

  updateCurrentScopeBySelectedTemplates = (activeTemplates) => {
    const { nerdStoreConfigData } = this.state;
    let updatedEntities = [];
    if (activeTemplates.scope === "global") {
      updatedEntities = this.filterEntitiesByDomains(this.props.nerdGraphEntityData.entities, nerdStoreConfigData.entityTypes);
    }
    else {
      let entityGuids = [];
      // get guids for all selected accounts
      activeTemplates.accounts.forEach((account) => {
        entityGuids = [
          ...entityGuids,
          ...(this.props.nerdGraphEntityData.accounts[account]),
        ];
      });
      // get entities for all selected guids
      updatedEntities = this.getEntitiesByGuid(
        this.props.nerdGraphEntityData.entities,
        entityGuids
      );
    }

    // filter by selected entityTypes
    return this.filterEntitiesByDomains(updatedEntities, nerdStoreConfigData.entityTypes);
  }

  getTemplateListMultiSelect(nerdStoreConfigData) {
    const templateList = [];
    nerdStoreConfigData.templates.forEach(template => {
      if (template.enabled) {
        templateList.push({
          key: template.id,
          value: template.name,
          text: `${template.name}: ${template.scope}`,
        });
      }
    })

    return templateList;
  }

  setGlobalTagStatus = (currentTemplates) => {
    const { nerdStoreConfigData, complianceItemStatus, displayFilter } = this.state;
    const entities = this.filterEntitiesByDomains(this.props.nerdGraphEntityData.entities, nerdStoreConfigData.entityTypes);

    let filteredEntities = this.getFilteredEntities(entities, complianceItemStatus, displayFilter);
    let tags = [];
    currentTemplates.forEach(template => {
      tags = [ ...tags, ...(template.tags) ];
    })
    filteredEntities = this.setEntitiesTagStatus(filteredEntities, tags);
    return {
      seletedTemplates: [],
      entities,
      filteredEntities,
    };
  }

  onSelectTemplate = (data) => {
    // based on the selectedTemplates (from Templates Dropdown):
        // get updated entities
        // set selectedTemplates
        // set filteredEntities

    // set scope, accounts, tags for multi-template selection
    const { nerdStoreConfigData, complianceItemStatus, displayFilter } = this.state;
    this.updateConfig('selectedTemplates', data.value);
    if (!data.value.length) {
      this.setState( this.setGlobalTagStatus(nerdStoreConfigData.templates) ); // if no templated selected -> include all tags from all templates
    }
    else {
      const activeTemplates = this.updateActiveTemplatesDetails(data.value);
      
      const entities = this.updateCurrentScopeBySelectedTemplates(activeTemplates);
      let filteredEntities = this.getFilteredEntities(entities, complianceItemStatus, displayFilter);
      filteredEntities = this.setEntitiesTagStatus(filteredEntities, activeTemplates.tags);

      this.setState({
        selectedTemplates: data.value,
        entities: entities,
        filteredEntities: filteredEntities,
      });
    }
  }

  loadNerdStoreData = async () => {
    const nerdStoreConfigData = await this.getConfigFromNerdStore();

    const accountList = this.getAccountListMultiSelect();
    const templateDropdownList = this.getTemplateListMultiSelect(nerdStoreConfigData);
    const domainList = nerdStoreConfigData.entityTypes;

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
      selectedTemplates: nerdStoreConfigData.selectedTemplates ? nerdStoreConfigData.selectedTemplates : [],
      selectedAccounts: nerdStoreConfigData.selectedAccounts ? nerdStoreConfigData.selectedAccounts : [],
      nerdStoreConfigData,
      disableButtons: false,
      accountList: accountList,
      complianceItemStatus: complianceItemStatus,
      templateDropdownList: templateDropdownList,
      loading: !(nerdStoreConfigData && nerdStoreConfigData.complianceBands && nerdStoreConfigData.complianceBands.highBand),
    }, () => {
      const tagStatusResult = this.setGlobalTagStatus(nerdStoreConfigData.templates); // returns: selectedTemplates, entities, filteredEntities

    this.setState({
      entities: tagStatusResult.entities,
      filteredEntities: tagStatusResult.filteredEntities,
    });
    }
    );
  }

  componentDidMount() {
    this.loadNerdStoreData();

  }

  openConfig = () => this.setState({ showConfigModal: true });

  closeConfig = () => this.setState({ showConfigModal: false });

  getAccountListMultiSelect() {
    const {
      nerdGraphEntityData: { accountList },
    } = this.props;
    return accountList;
  }

  getComplianceBand = (score) => {
    const { complianceBands } = this.state.nerdStoreConfigData
    if (score >= complianceBands.highBand.lowerLimit) return 'high__band';
    else if (
      complianceBands.midBand.lowerLimit <= score &&
      score < complianceBands.midBand.upperLimit
    )
      return 'mid__band';
    else return 'low__band';
  };

  getCompliance(entities, itemType, itemName) {
    const { nerdStoreConfigData, complianceItemStatus } = this.state;

    let e1 = [];
    switch (itemType) {
      case 'domain':
        // one domain
        e1 = entities.filter((entity) => entity.domain === itemName);
        break;
      case 'account':
        e1 = this.filterEntitiesByDomains(entities, nerdStoreConfigData.entityTypes);
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

  updateCurrentScopeBySelectedAccounts(selectedAccounts) {
    let updatedEntities = [];

    if (selectedAccounts.length === 0) {
      updatedEntities = this.props.nerdGraphEntityData.entities;
    } else {
      let entityGuids = [];
      selectedAccounts.forEach((item) => {
        entityGuids = [
          ...entityGuids,
          ...this.props.nerdGraphEntityData.accounts[item.split(':')[0]],
        ];
      });
      updatedEntities = this.getEntitiesByGuid(
        this.props.nerdGraphEntityData.entities,
        entityGuids
      );
    }

    return updatedEntities;
  }

  getFilteredEntities(entities, complianceItemStatus, displayFilter) {
    const { nerdStoreConfigData } = this.state;
    let filteredEntities;

    // filter entities by entityTypes from nerdStore Config
    entities = this.filterEntitiesByDomains(entities, nerdStoreConfigData.entityTypes);

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
    this.updateConfig('selectedAccounts', data.value);
    const entities = this.updateCurrentScopeBySelectedAccounts(data.value);
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
      templateDropdownList,
      selectedAccounts,
      selectedTemplates,
      showConfigModal,
      nerdStoreConfigData,
    } = this.state;
    const { user, userAccount } = this.props;
    const selectedAccount = accountList.find(account => account.id === userAccount);

    const modalStyle = { width: '90%', height: '90%' };

    return (loading ?
        <Spinner />
      :
      <div className="container">
        <MenuBar 
          accounts={accountList} 
          selectedAccount={selectedAccount} 
          onAccountChange={this.onSelectAccount}
          templates={templateDropdownList} 
          selectedTemplates={nerdStoreConfigData.selectedTempaltes} 
          change={this.onSelectTemplate} 
          openConfig={this.openConfig} 
        />

        <div className="score__container">
          <div className="score__panel">
            <Stack>
              <StackItem columnSpan={12}>
                {this.renderComplianceScore(entities, 'account', 'account')}
              </StackItem>
              <StackItem>
                <Stack>
                  {nerdStoreConfigData.entityTypes.map(
                    (domain) => {
                      return this.renderComplianceScore(entities, 'domain', domain);
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
            complianceBands={nerdStoreConfigData.complianceBands}
            entities={filteredEntities.sort(function (a, b) {
              return a.account.id - b.account.id;
            })}
          />
          <EntityTable entities={filteredEntities} complianceBands={nerdStoreConfigData.complianceBands} />
        </div>
        {showConfigModal ? (
          <Modal style={modalStyle} onClose={this.closeConfig}>
            <Config accounts={accountList} user={user} userAccount={userAccount} onUpdate={(data) => this.updateState(data)} />
          </Modal>
        ): null}
      </div>
    );
  }
}

Entities.propTypes = {
  nerdGraphEntityData: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  userAccount: PropTypes.number.isRequired,
  // nerdStoreConfigData: PropTypes.object.isRequired,
  // updateParentState: PropTypes.func.isRequired,
  // onAccountChange: PropTypes.func.isRequired,
};

export default Entities;
