import React from 'react';
import PropTypes from 'prop-types';

import { AccountStorageMutation, AccountStorageQuery } from 'nr1';

import utils from './utils';

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
    defaultComplianceBands: {
      highBand: { upperLimit: 100, lowerLimit: 90, color: 'seagreen' },
      midBand: { upperLimit: 90, lowerLimit: 70, color: 'sandybrown' },
      lowBand: { upperLimit: 70, lowerLimit: 0, color: 'orangered' },
    }
  };

  componentDidMount() {
    this.fetchConfig();
  }

  fetchConfig = async () => {
    const { defaultComplianceBands } = this.state;
    const { userAccount } = this.props;

    const config = await AccountStorageQuery.query({
      accountId: userAccount,
      collection: 'tag-analyser',
      documentId: 'config',
    });

    const data = (config || {}).data;

    this.setState({ data });
  };

  updateConfig = async (type, updatedData) => {
    const { data } = this.state;
    const { userAccount, onUpdate } = this.props;

    const newData = utils.deepCopy(data);
    newData[type] = updatedData;
    await AccountStorageMutation.mutate({
      accountId: userAccount,
      actionType: AccountStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
      collection: 'tag-analyser',
      documentId: 'config',
      document: newData,
    });
    this.setState({ data: newData }, () => onUpdate ? onUpdate(newData) : null);
  };

  switchTab = async (e, id) => {
    e.preventDefault();
    this.setState({ currentTab: id });
  };

  render() {
    const {
      currentTab,
      defaultComplianceBands,
      data: { templates, entityTypes, complianceBands } = {},
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
              complianceBands={complianceBands || defaultComplianceBands}
              onUpdate={this.updateConfig}
            />
          </div>
        </div>
      </div>
    );
  }
}
