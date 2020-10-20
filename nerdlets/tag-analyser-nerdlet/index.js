import React from "react";
import { 
  Icon, 
  HeadingText, 
  NerdGraphQuery, 
  AccountStorageQuery, 
  AccountStorageMutation, 
  UserStorageQuery,
  UserStorageMutation,
  Spinner,
 } from "nr1";

import Entities from "./components/Entities";

import helpers from "../shared/utils/helpers";
import Modal from './components/Modal/Modal';
import Config from './components/Config/Config';
import utils from './components/Config/utils'


export default class TagAnalyser extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    userAccount: null, //192626,
    user: {},
    nerdGraphEntityData: {
      entities: [],
      accounts: {}, // SK -- {},
      entityTypes: {},
      accountList: [],
    },
    nerdStoreConfigData: {},
    showConfigModal: false,
    entityCount: 0,
    loadedEntities: 0,
    doneLoading: false,
    loadError: undefined,
    queryCursor: undefined,
 };

  static config = {
    hasTagFilterBar: false,
    timePicker: {
      isEnabled: false,
    },
  };

  updateParentState = (data) => {
    console.log(">>> main-index.updateParentState: ", data);
    // this.setState({
    //   nerdStoreConfigData: data,
    //   nerdGraphEntityData: {},
    // });
  }

  onAccountChange = async (data) => {
    console.log("@@>>> index.onAccountChange.selected account: ", data);
    // await this.updateUserconfig({ userAccount: parseFloat(data.value.split[0]) })
    // this.loadData();
  }

  getConfigFromNerdStore = async () => {
    const data = await this.fetchConfig();
    console.log("index.getConfigFromNerdStore: data: ", data);

    const templateExists = data && data.templates && data.templates.length > 0;
    const complianceBandsExists = data && data.complianceBands && Object.keys(data.complianceBands).length === 3;
    const entityTypesExists = data && data.entityTypes && data.entityTypes.length > 0;

    if ( !(templateExists && complianceBandsExists && entityTypesExists) ) {
      // await createDefaultConfig();

      // // force user to config modal
      // const errorInfo = { 
      //   msg: "Please update the following configuration option(s) to continue...",
      //   items: [],
      // }
      // if (!templateExists) errorInfo.items.push("Templates")
      // if (!complianceBandsExists) errorInfo.items.push("Compliance Bands")
      // if (!entityTypesExists) errorInfo.items.push("Entity Types")

      this.openConfig(); // showConfigModal to true
      // show popupwindows with message
    }
    else {
      // this.openConfig(); // ### SKTEST - TEMPORARY ###

      const templateList = data.templates.length ?
        data.templates.filter(template => template.enabled).map((template, index) => ({
            id: index,
            key: template.name,
            text: template.name,
            value: template.name,
        }))
      :
        [];
      
      this.setState({
        templates: data.templates,
        templateList, // for dropdown use
        complianceBands: data.complianceBands || helpers.defaultComplianceBands, 
        entityTypes: data.entityTypes || helpers.defaultentityTypes,
      });
    }
  }

  loadData = async () => {
    // const result = await this.fetchUserConfig(); // this updates the userAccount in this.state
    this.startLoadingEntityTags();

  }

  async componentDidMount() {
    this.loadData();


    // // SKTEST
    // const result = await this.updateUserConfig({userAccount: 192626});
    // console.log("from updateUserConfig: updated : result: ", result);

    // const data = await this.fetchUserConfig();
    // console.log("from fetchUserConfig: read data: ", data);

  }

  render() {
    const {doneLoading, entityCount, loadedEntities, nerdGraphEntityData, accountList, userAccount, user } = this.state

    const { nerdStoreConfigData } = this.state;
    const {showConfigModal } = this.state;
    const modalStyle = { width: '90%', height: '90%' };

    if (entityCount < 1 || loadedEntities < 1) {
      if (doneLoading) {
        return (
          <HeadingText type={HeadingText.TYPE.HEADING_3}>
            No tags / entities could be loaded.
          </HeadingText>
        );
      } else {
        return (<Spinner />);
      }
    }

    if (showConfigModal) {
      return (
        <Modal style={modalStyle} onClose={this.closeConfig}>
          <Config accounts={accountList} user={user} userAccount={userAccount} onUpdate={this.updateParentState} />
        </Modal>
      )
    }
    
    return (
      <>
        {doneLoading ? null : (
          <HeadingText type={HeadingText.TYPE.HEADING_4}>
            Loading tags... ({loadedEntities} / {entityCount} entities examined)
          </HeadingText>
        )}
          <Entities
            nerdGraphEntityData={nerdGraphEntityData}
            user={user}
            userAccount={userAccount}
            // nerdStoreConfigData={nerdStoreConfigData}
            // updateParentState={this.updateParentState}
            // onAccountChange={this.onAccountChange}
          />
        
      </>
    );
  }

  startLoadingEntityTags = () => {
    // reset all cached state and then fetch the first page of entity results...
    const { loadEntityBatch } = this;

    this.setState(
      {
        user: {},
        nerdGraphEntityData: {
          entities: [],
          accounts: {}, // SK -- {},
          entityTypes: {},
          accountList: [],
        },
        entityCount: 0,
        loadedEntities: 0,
        doneLoading: false,
        loadError: undefined,
        queryCursor: undefined,
      },
      () => {
        loadEntityBatch();
      }
    );
  };

  loadEntityBatch = () => {
    const {
      processEntityQueryResults,
      state: { queryCursor },
    } = this;

    const query = `
    query EntitiesSearchQuery($queryString: String!, $nextCursor: String) {
      actor {
        user {
          email
          id
          name
        }
        accounts {
          id
          name
        }
        entitySearch(query: $queryString) {
          count
          results(cursor: $nextCursor) {
            entities {
              account {
                id
                name
              }
              name
              domain
              entityType
              guid
              tags {
                tagKey: key
                tagValues: values
              }
            }
            nextCursor
          }
        }
      }
    }
    `;
    const variables = {
      queryString: "domain in ("  +  helpers.defaultEntityTypes.join(", ")  +  ")",
    };
    if (queryCursor) {
      variables.nextCursor = queryCursor;
    }

    NerdGraphQuery.query({
      query,
      variables,
    })
      .then(({ loading, data, errors }) => {
        if (data) {
          processEntityQueryResults(data);
        } else {
          console.log("data is NOT truthy", data);
        }
        if (errors) {
          console.log("Entity query error", errors);
        }
      })
      .catch((err) => {
        this.setState({ loadError: err.toString() });
      });
  };

  processEntityQueryResults = (data) => {
    const {
      loadEntityBatch,
      setState,
      state: { loadedEntities, nerdGraphEntityData },
    } = this;

    let user = {};
    let entityCount = 0;
    let entities = [];
    let nextCursor = undefined;
    try {
      user = data.actor.user || {};
      entityCount = data.actor.entitySearch.count;
      entities = data.actor.entitySearch.results.entities || [];
      nextCursor = data.actor.entitySearch.results.nextCursor || undefined;
    } catch (err) {
      console.log("Error parsing results", err);
    }
    this.processLoadedEntities(entities); // SK

    this.setState(
      {
        queryCursor: nextCursor,
        entityCount,
        loadedEntities: loadedEntities + entities.length,
        doneLoading: !nextCursor,
        user,
      },
      () => {
        if (nextCursor) {
          loadEntityBatch();
        }
        else {
          this.getConfigFromNerdStore();
        }
      }
    );
  };

  processLoadedEntities = (entities) => {
    const { nerdGraphEntityData } = this.state;
    let { userAccount } = this.state;

    let newNerdGraphEntityData = utils.deepCopy(nerdGraphEntityData);

    console.log("processLoadedEntities.this.state.userAccount: ", this.state.userAccount);
    entities.forEach((entity) => {
      // get all the tags
      const { tags } = entity;
      entity.mandatoryTags = [];
      entity.optionalTags = [];
      entity.complianceScore = 0.00;

      if (!userAccount) {
        userAccount = parseFloat(entity.tags.find(tag => tag.tagKey === "trustedAccountId").tagValues[0]);
        // console.log("userAccount: ", userAccount);
      }

      newNerdGraphEntityData.entities.push(entity);

      const acctId = /*'rpm-' +*/ entity.account.id.toString()
      if (!newNerdGraphEntityData.accounts[acctId]) newNerdGraphEntityData.accounts[acctId] = []
      newNerdGraphEntityData.accounts[acctId].push(entity.guid)

      if ( typeof(newNerdGraphEntityData.accountList.find(item => item.id.toString() === acctId)) === "undefined" ) {
        newNerdGraphEntityData.accountList.push({
          id: entity.account.id,
          key: newNerdGraphEntityData.accountList.length, 
          value: `${entity.account.id}: ${entity.account.name}`, 
          text: entity.account.name,
        });
      }

      
      const domain = entity.domain
      if (!newNerdGraphEntityData.entityTypes[domain]) newNerdGraphEntityData.entityTypes[domain] = []
      newNerdGraphEntityData.entityTypes[domain].push(entity.guid)

    });
    this.setState({
      userAccount: userAccount || null,
      nerdGraphEntityData: newNerdGraphEntityData,
    })
  };


  openConfig = () => this.setState({ showConfigModal: true });

  closeConfig = () => this.setState({ showConfigModal: false });

  fetchConfig = async () => {
    const { userAccount } = this.state;

    const config = await AccountStorageQuery.query({
      accountId: userAccount,
      collection: helpers.nerdStoreInfo.collectionName, // 'tag-analyser',
      documentId: helpers.nerdStoreInfo.documentName,   // 'config',
    });

    const result = (config || {}).data;

    return result;
  };

  fetchUserConfig = async () => {
    let userData = null;
    const result = await UserStorageQuery.query({
      collection: helpers.nerdStoreInfo.collectionName, // 'tag-analyser',
      documentId: helpers.nerdStoreInfo.documentName,   // 'config',
    }).then(({ data }) => {
      console.log("index.fetchUserConfig: ",data.userData.userAccount);
      userData = data.userData;
    });

    if (userData && userData.userAcount && typeof(userData.userAccount) === 'number') {
      this.setState({ userAccount: userData.userAccount });
      console.log("fetchUserConfig.this.state.userAccount: ", this.state.userAccount);
    }

    return userData;
  }

  updateUserConfig = async (userData) => {
    const result = await UserStorageMutation.mutate({
      actionType: UserStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
      collection: helpers.nerdStoreInfo.collectionName, // 'tag-analyser',
      documentId: helpers.nerdStoreInfo.documentName,   // 'config',
      document: {
        userData,
      },
    });
    console.log("index.updateUserConfig: ",result);
    return result;
  }

}
