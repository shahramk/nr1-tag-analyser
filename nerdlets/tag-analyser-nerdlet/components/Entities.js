import React from 'react';
import PropTypes from 'prop-types';

import { sortBy } from 'lodash';
import { Spinner, Stack, StackItem } from 'nr1';

import MenuBar from './MenuBar/MenuBar';
import ComplianceScore from './ComplianceScore/ComplianceScore';
import EntityHeader from './EntityTable/EntityHeader';
import EntityTable from './EntityTable/EntityTable';
import Modal from './Modal/Modal';
import Config from './Config/Config';
import utils from './Config/utils';

class Entities extends React.PureComponent {
  state = {
    loading: true,
    entities: [],
    domainEntities: [],
    accountEntities: [],
    nerdStoreConfigData: {},
    tempConfigData: null,
    displayFilter: 'FULL',
    selectedDomain: 'none',
    selectedAccounts: [],
    accountList: [],
    complianceItemStatus: {
      global: true,
      entityType: [],
    },
    showConfigModal: false,
    tags: {},
  };

  // todo: state management needs to be moved to index.js
  componentDidMount() {
    const { nerdStoreConfigData, nerdGraphEntityData, accounts } = this.props;

    const accountEntities = utils.deepCopy(nerdGraphEntityData.entities);
    const accountList = utils.deepCopy(accounts);
    const nerdStoreConfigCopy = utils.deepCopy(nerdStoreConfigData);

    this.setState(
      {
        entities: nerdGraphEntityData.entities,
        nerdStoreConfigData: nerdStoreConfigCopy,
        accountEntities,
        accountList,
      },
      () => {
        this.processEntityTypes();
      }
    );
  }

  processEntityTypes = () => {
    const { nerdStoreConfigData, selectedDomain } = this.state;

    const complianceItemStatus = {};
    complianceItemStatus.global = selectedDomain === 'none' ? true : false;
    complianceItemStatus.entityType = [];
    nerdStoreConfigData.entityTypes.forEach((domainName) => {
      complianceItemStatus.entityType.push({
        name: domainName,
        selected: domainName === selectedDomain ? true : false,
        active: domainName === selectedDomain || complianceItemStatus.global ? true : false,
      });
    });

    nerdStoreConfigData.entityTypes = nerdStoreConfigData.entityTypes.sort();

    this.setState(
      {
        complianceItemStatus: complianceItemStatus,
      },
      () => {
        this.processTags();
      }
    );
  };

  // organize tags by account scope and remove duplicates
  processTags = () => {
    const { nerdStoreConfigData } = this.state;
    const tags = {};

    const globalTemplates = nerdStoreConfigData.templates.filter(
      (template) => template.scope === 'global'
    );
    const accountTemplates = nerdStoreConfigData.templates.filter(
      (template) => template.scope !== 'global'
    );

    globalTemplates.forEach((template) => {
      const globalTags = tags.global;
      if (globalTags) {
        template.tags.forEach((tag) => {
          this.addUniqueTag(globalTags, tag);
        });
      } else {
        tags.global = template.tags;
      }
    });

    accountTemplates.forEach((template) => {
      template.accounts.forEach((account) => {
        const accountTags = utils.deepCopy(tags[account]);
        if (accountTags) {
          template.tags.forEach((tag) => {
            this.addUniqueTag(accountTags, tag);
          });
          tags[account] = accountTags;
        } else {
          tags[account] = template.tags;
        }
      });
    });

    // if an account has been set up with specific templates, merge the global set in
    // there is no other way to properly identify duplicates between account and global level
    // when applying tags to scoring, or displaying the tags, account=level tags override global
    for (const [key, value] of Object.entries(tags)) {
      if (key !== 'global') {
        tags.global.forEach((tag) => {
          this.addUniqueTag(value, tag);
        });
      }
    }

    this.setState({ tags }, () => this.processEntities());
  };

  addUniqueTag(tags, tag) {
    const found = tags.find((t) => t.name === tag.name);

    if (found) {
      if (
        tag.mandatory !== found.mandatory &&
        tag.mandatory &&
        !found.mandatory
      ) {
        found.mandatory = true;
      }
    } else {
      tags.push(tag);
    }
  }

  // score entities based on tag rules
  processEntities = () => {
    const { nerdStoreConfigData, entities, tags, selectedAccounts } = this.state;

    const entitiesCopy = utils.deepCopy(
      entities.filter((entity) => {
        return nerdStoreConfigData.entityTypes.find(
          (type) => type === entity.domain
        );
      })
    );

    entitiesCopy.forEach((entity) => {
      // check for account-specific tags; otherwise default to global
      let accountTags =
        tags[Object.keys(tags).find((t) => t === entity.account.id.toString())];

      if (!accountTags) accountTags = tags.global;

      entity.mandatoryTags = [];
      entity.optionalTags = [];
      let compliance = 0;
      const mandatoryTagCount = accountTags.filter((t) => t.mandatory).length;

      accountTags.forEach((accountTag) => {
        const found = entity.tags.find((tag) => tag.tagKey === accountTag.name);

        if (found) {
          if (accountTag.mandatory) {
            entity.mandatoryTags.push(found);
            compliance += 1;
          } else {
            entity.optionalTags.push(found);
          }
        } else if (accountTag.mandatory) {
          entity.mandatoryTags.push({
            tagKey: accountTag.name,
            tagValues: ['<undefined>'],
          });
        } else {
          entity.optionalTags.push({
            tagKey: accountTag.name,
            tagValues: ['<undefined>'],
          });
        }
      });
      entity.complianceScore = (compliance / mandatoryTagCount) * 100;
    });

    const accountEntities = this.getEntitiesBySelectedAccounts(entitiesCopy, selectedAccounts);

    this.setState({
      domainEntities: entitiesCopy,
      accountEntities, //: entitiesCopy,
      loading: false,
    });
  };

  getEntitiesBySelectedAccounts = (entities, selectedAccounts) => {
    // update entities filtered by "selectedAccounts" from accounts dropdown
    let filteredEntities = [];
    if (selectedAccounts.length === 0) {
      filteredEntities = utils.deepCopy(entities);
    }
    else {
      selectedAccounts.forEach(selectedAccount => {
        filteredEntities = filteredEntities.concat(
          entities.filter(
            (entity) => entity.account.id.toString() === selectedAccount.split(':')[0]
          )
        );
      });
    }

    return filteredEntities;
  }


  getComplianceBand = (score) => {
    const { complianceBands } = this.state.nerdStoreConfigData;
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
      case 'account':
        e1 = entities;
        break;
    }
    const complianceSum = e1.reduce((acc, e) => acc + e.complianceScore, 0);
    const score =
      complianceSum > 0.0
        ? parseFloat(complianceSum / e1.length).toFixed(2)
        : 0.0;
    const band = this.getComplianceBand(score);
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

  getTableEntities = () => {
    // extract entities to display
    const { accountEntities, complianceItemStatus, displayFilter } = this.state;

    let filteredEntities = utils.deepCopy(accountEntities);

    // filter displayed entities by entity types (if any)
    complianceItemStatus.entityType.forEach((et) => {
      if (et.selected) {
        filteredEntities = accountEntities.filter(
          (entity) => entity.domain === et.name
        );
      }
    });

    switch (displayFilter) {
      case 'IN_COMPLIANCE':
        filteredEntities = filteredEntities.filter(
          (entity) => entity.complianceScore === 100
        );
        break;

      case 'OUT_OF_COMPLIANCE':
        filteredEntities = filteredEntities.filter(
          (entity) => entity.complianceScore !== 100
        );
        break;
    }

    filteredEntities = sortBy(filteredEntities, ['account.name', 'domain']);

    return filteredEntities;
  };

  getTableFilters() {
    // display all filers on the report heading
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

  onSelectAccount = (data) => {
    const { domainEntities } = this.state;
    let filteredEntities = [];

    if (data.value.length === 0) {
      filteredEntities = utils.deepCopy(domainEntities);
    } else {
      data.value.forEach((value) => {
        filteredEntities = filteredEntities.concat(
          domainEntities.filter(
            (entity) => entity.account.id.toString() === value.split(':')[0]
          )
        );
      });
    }
    this.setState({
      accountEntities: filteredEntities,
      selectedAccounts: data.value,
    });
  };

  onSelectEntityType = (itemType, itemName) => {
    const { complianceItemStatus } = this.state;
    const complianceItemCopy = utils.deepCopy(complianceItemStatus);

    let selectedDomain = 'none';

    switch (itemType) {
      case 'account': {
        complianceItemCopy.global = true;
        complianceItemCopy.entityType.forEach((domain) => {
          domain.selected = false;
          domain.active = true;
        });

        break;
      }
      case 'domain': {
        const et = complianceItemCopy.entityType.find(
          (domain) => domain.name === itemName
        );

        if (et.selected) {
          // was selected - now being unselected
          complianceItemCopy.global = true;
          complianceItemCopy.entityType.forEach((domain) => {
            domain.selected = false;
            domain.active = true;
          });
        } else {
          complianceItemCopy.global = false;
          complianceItemCopy.entityType.forEach((domain) => {
            if (domain.name === itemName) {
              domain.selected = true;
              domain.active = true;
              selectedDomain = itemName;
            } else {
              domain.selected = false;
              domain.active = false;
            }
          });
        }
        break;
      }
    }

    this.setState({ selectedDomain, complianceItemStatus: complianceItemCopy });
  };

  onFilterEntityTable = (filter) => {
    this.setState({
      displayFilter: filter,
    });
  };

  onOpenConfig = () => this.setState({ showConfigModal: true });

  // todo - be smarter about what changed
  onUpdateConfig = (data) => {
    this.setState({ tempConfigData: data });
  };

  onCloseConfig = () => {
    const { tempConfigData } = this.state;
    const tempConfig = utils.deepCopy(tempConfigData);

    if (tempConfig) {
      this.setState(
        {
          loading: true,
          nerdStoreConfigData: tempConfig,
          tempConfigData: null,
          showConfigModal: false,
        },
        () => {
          this.processEntityTypes();
        }
      );
    } else {
      this.setState({ showConfigModal: false });
    }
  };

  renderComplianceScore(entities, itemType, itemName) {
    const compliance = this.getCompliance(entities, itemType, itemName);

    return (
      <ComplianceScore
        key={itemName}
        select={this.onSelectEntityType}
        compliance={compliance}
      />
    );
  }

  render() {
    const {
      loading,
      accountEntities,
      accountList,
      selectedAccounts,
      showConfigModal,
      nerdStoreConfigData,
    } = this.state;
    const tableEntities = this.getTableEntities();
    const { user } = this.props;
    const modalStyle = { width: '90%', height: '90%' };

    return loading ? (
      <Spinner />
    ) : (
      <div className="container">
        <MenuBar
          accounts={accountList}
          selectedAccounts={selectedAccounts}
          onAccountChange={this.onSelectAccount}
          openConfig={this.onOpenConfig}
        />

        <div className="score__container">
          <div className="score__panel">
            <Stack>
              <StackItem columnSpan={12}>
                {this.renderComplianceScore(
                  accountEntities,
                  'account',
                  'account'
                )}
              </StackItem>
              <StackItem>
                <Stack>
                  {nerdStoreConfigData.entityTypes.map((domain) => {
                    return this.renderComplianceScore(
                      accountEntities,
                      'domain',
                      domain
                    );
                  })}
                </Stack>
              </StackItem>
            </Stack>
          </div>
        </div>

        <div className="table__container">
          <EntityHeader
            filter={this.onFilterEntityTable}
            count={tableEntities.length}
            accounts={
              selectedAccounts.length > 0 ? selectedAccounts.join(', ') : ''
            }
            entityType={this.getTableFilters().join(', ')}
            complianceBands={nerdStoreConfigData.complianceBands}
            entities={tableEntities}
          />
          <EntityTable
            entities={tableEntities}
            complianceBands={nerdStoreConfigData.complianceBands}
          />
        </div>
        {showConfigModal ? (
          <Modal style={modalStyle} onClose={this.onCloseConfig}>
            <Config
              accounts={accountList}
              user={user}
              onUpdate={this.onUpdateConfig}
            />
          </Modal>
        ) : null}
      </div>
    );
  }
}

Entities.propTypes = {
  nerdGraphEntityData: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  nerdStoreConfigData: PropTypes.object.isRequired,
  accounts: PropTypes.array.isRequired,
};

export default Entities;
