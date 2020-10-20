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
    userAccount: PropTypes.number,
    onUpdate: PropTypes.func,
  };

  state = {
    currentTab: 0,
  };

  componentDidMount() {
    this.fetchConfig();
  }

  fetchConfig = async () => {
    const { userAccount } = this.props;

    const config = await AccountStorageQuery.query({
      accountId: userAccount,
      collection: helpers.nerdStoreInfo.collectionName, // 'tag-analyser',
      documentId: helpers.nerdStoreInfo.documentName,   // 'config',
    });

    const nerdStoreConfigData = (config || {}).data || {templates: [], complianceBands: {}, entityTypes: []};

    this.setState({ nerdStoreConfigData });
  };

  updateConfig = async (type, updatedData) => {
    const { nerdStoreConfigData } = this.state;
    const { userAccount, onUpdate } = this.props;

    const newData = utils.deepCopy(nerdStoreConfigData);
    newData[type] = updatedData;
    await AccountStorageMutation.mutate({
      accountId: userAccount,
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
              entityTypes={entityTypes || []}
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
