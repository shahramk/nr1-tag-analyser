import React from 'react';
import PropTypes from 'prop-types';

import { Spinner, AccountStorageMutation, AccountStorageQuery } from 'nr1';

import utils from './utils';
import helpers from '../../../shared/utils/helpers'

import Templates from './Templates';
import EntityTypes from './EntityTypes';
import ComplianceBands from './ComplianceBands';

export default class Config extends React.Component {
  static propTypes = {
    accounts: PropTypes.array,
    user: PropTypes.object,
    onUpdate: PropTypes.func,
  };

  state = {
    currentTab: 0,
    configSent: false,
  };

  componentDidMount() {
    this.fetchConfig();
  }

  fetchConfig = async () => {
    const config = await AccountStorageQuery.query({
      accountId: helpers.masterAccountId,
      collection: helpers.nerdStoreInfo.collectionName, // 'tag-analyser',
      documentId: helpers.nerdStoreInfo.documentName,   // 'config',
    });

    // const nerdStoreConfigData = (config || {}).data || {templates: [], complianceBands: helpers.defaultComplianceBands, entityTypes: []};
    
    if (!config) config = {};
    if (!config.data) config.data = {};
    if (!config.data.templates) config.data.termplates = [];
    if (!config.data.complianceBands || Object.keys(config.data.complianceBands) == 0) config.data.complianceBands = helpers.defaultComplianceBands;
    if (!config.data.entityTypes) config.data.entityTypes = [];
    const nerdStoreConfigData = config.data;

    this.setState({ nerdStoreConfigData }, () => {
      if (!this.state.configSent) {
        this.props.onUpdate(nerdStoreConfigData);
        this.setState({ configSent: true });
      }
    });
  };

  updateConfig = async (type, updatedData) => {
    const { nerdStoreConfigData } = this.state;
    const { onUpdate } = this.props;

    const newData = utils.deepCopy(nerdStoreConfigData);
    newData[type] = updatedData;
    await AccountStorageMutation.mutate({
      accountId: helpers.masterAccountId,
      actionType: AccountStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
      collection: helpers.nerdStoreInfo.collectionName, // 'tag-analyser',
      documentId: helpers.nerdStoreInfo.documentName,   // 'config',
      document: newData,
    });
    this.setState({ nerdStoreConfigData: newData }, () => onUpdate ? onUpdate(newData) : null);
  };

  switchTab = async (e, id) => {
    e.preventDefault();
    this.setState({ currentTab: id });
  };

  render() {
    const {
      currentTab,
      nerdStoreConfigData: { templates, entityTypes, complianceBands } = {},
    } = this.state;
    const {
      accounts,
      user: { email },
    } = this.props;

    const tabs = ['Templates', 'Entity Types', 'Compliance Bands'];
    const tabProps = {
      href: '#',
      className: 'u-unstyledLink',
    };
    const tabIsActive = (t) => (currentTab === t ? 'active' : '');

    // console.log("complianceBands: ", complianceBands)
    // console.log("helpers.defaultComplianceBands: ", helpers.defaultComplianceBands)
    return (
      <>
        {!complianceBands ? 
            <Spinner />
        : (
      <div className="config-screen">
        <div className="tabs">
          <ul className="tabs-links">
            {tabs.map((tab, t) => (
              <li key={t} className={tabIsActive(t)}>
                <a {...tabProps} onClick={(e) => this.switchTab(e, t)}>
                  {tab}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="tabs-content">
          <div className={tabIsActive(0)}>
            <Templates
              templates={templates || []}
              accounts={accounts}
              userEmail={email}
              onUpdate={this.updateConfig}
            />
          </div>
          <div className={tabIsActive(1)}>
            <EntityTypes
              entityTypes={entityTypes || helpers.defaultEntityTypes}
              onUpdate={this.updateConfig}
            />
          </div>
          <div className={tabIsActive(2)}>
            <ComplianceBands
              complianceBands={complianceBands || helpers.defaultComplianceBands}
              onUpdate={this.updateConfig}
            />
          </div>
        </div>
      </div>
    )}
    </>
    )
  }
}
