import React from "react";
import { 
  HeadingText, 
  NerdGraphQuery, 
  AccountStorageQuery, AccountStorageMutation,
  Spinner,
  Button,
 } from "nr1";

import Entities from "./components/Entities";

import helpers from "../shared/utils/helpers";
import Modal from './components/Modal/Modal';
import Config from './components/Config/Config';
import utils from './components/Config/utils'


export default class TagAnalyser extends React.PureComponent {
  state = {
    userLoading: true,
    templateLoading: true,
    templateInitialized: false,

    tempTemplates: null,

    user: null,
    nerdGraphEntityData: {
      entities: [],
    },
    nerdStoreConfigData: {},
    nerdStoreError: false,
    nerdStoreErrorMessages: [],
    configErrors: [],
    showConfigEntryMessage: false,
    showConfigModal: false,
    showConfigExitMessage: false,
    entityCount: 0,
    loadedEntities: 0,
    entityLoading: true,
    loadError: undefined,
    queryCursor: undefined,
  };

  async componentDidMount() {
    await this.getUserInfo();

  }

  getUserInfo = async () => {
    const query = `
    {
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
      }
    }    
    `;
    
    try {
      const { loading, data, errors } = await NerdGraphQuery.query({
        query,
      });

      if (data) {
        const accountList = [];
        data.actor.accounts.forEach(account => {
          accountList.push({
            id: account.id,
            key: accountList.length, 
            value: `${account.id}: ${account.name}`, 
            text: account.name,
          });
        })

        this.setState({ user: data.actor.user, accounts: accountList, userLoading: false, }, () => {
          this.getConfigFromNerdStore();
        });
      } else {
        console.log("data is NOT truthy", data);
      }
      if (errors) {
        console.log("errors:", errors);
    }
  }
  catch(err) {
        this.setState({ loadError: err.toString() });
    };
  }

  getConfigFromNerdStore = async () => {
    const data = await this.fetchConfig();

    if (data && data.errors) {
      console.log(data.errors);
      const nerdStoreErrorMessages = data.errors.map(err => err.message)
      this.setState({ 
        nerdStoreError: true,
        nerdStoreErrorMessages,
      });
    }
    else {
      const templateExists = data && data.templates && data.templates.length > 0;
      const complianceBandsExists = data && data.complianceBands && Object.keys(data.complianceBands).length === 3;
      const entityTypesExists = data && data.entityTypes && data.entityTypes.length > 0;

      if ( !(templateExists && complianceBandsExists && entityTypesExists) ) {
        const configErrors = [];
        if (!templateExists) configErrors.push("Templates");
        if (!entityTypesExists) configErrors.push("Entity Types");
        if (!complianceBandsExists) configErrors.push("Compliance Score Bands");
        this.setState({ 
          templateLoading: false,
          templateInitialized: false,
          showConfigModal: true,
          showConfigEntryMessage: true,
          configErrors,
        });
      }
      else {
        const nerdStoreConfigData = {
          templates: data.templates,
          complianceBands: data.complianceBands || helpers.defaultComplianceBands, 
          entityTypes: data.entityTypes || helpers.defaultentityTypes,
        }
        this.setState({ 
          nerdStoreConfigData, 
          templateLoading: false, 
          templateInitialized: true,
        }, () => {
          this.startLoadingEntityTags()
        });
      }
    }
  }

  fetchConfig = async () => {

    const config = await AccountStorageQuery.query({
      accountId: helpers.masterAccountId,
      collection: helpers.nerdStoreInfo.collectionName, // 'tag-analyser',
      documentId: helpers.nerdStoreInfo.documentName,   // 'config',
    });

    // const result = (config || {}).data;
    const result = config.errors ? config : (config || {}).data;

    return result;
  };

  startLoadingEntityTags = () => {
    // reset all cached state and then fetch the first page of entity results...
    const { loadEntityBatch } = this;

    this.setState(
      {
        nerdGraphEntityData: {
          entities: [],
        },
        entityCount: 0,
        loadedEntities: 0,
        entityLoading: true,
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
      queryString: "domain in ("  +  helpers.defaultEntityTypes.map(item => "'" + item + "'").join(", ")  +  ")",
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
    const { loadedEntities } = this.state;
    let entityCount = 0;
    let entities = [];
    let nextCursor = undefined;
    try {
      entityCount = data.actor.entitySearch.count;
      entities = data.actor.entitySearch.results.entities || [];
      nextCursor = data.actor.entitySearch.results.nextCursor || undefined;
    } catch (err) {
      console.log("Error parsing results", err);
    }
    this.processLoadedEntities(entities);

    this.setState(
      {
        queryCursor: nextCursor,
        entityCount,
        loadedEntities: loadedEntities + entities.length,
        entityLoading: nextCursor,
      },
      () => {
        if (nextCursor) {
          this.loadEntityBatch();
        }
      }
    );
  };

  processLoadedEntities = (entities) => {
    const { nerdGraphEntityData } = this.state;

    let newNerdGraphEntityData = utils.deepCopy(nerdGraphEntityData);
    entities.forEach((entity) => {
      entity.mandatoryTags = [];
      entity.optionalTags = [];
      entity.complianceScore = 0.00;
      newNerdGraphEntityData.entities.push(entity);
    });
    this.setState({
      nerdGraphEntityData: newNerdGraphEntityData,
    })
  };

  onCloseConfig = () => {
    const tempTemplates = utils.deepCopy(this.state.tempTemplates);

    if (tempTemplates) { 
      // make sure all config components exist (templates, complianceBands, entityTypes)
      const templateExists = tempTemplates.templates && tempTemplates.templates.length > 0;
      const complianceBandsExists = tempTemplates.complianceBands && Object.keys(tempTemplates.complianceBands).length === 3;
      const entityTypesExists = tempTemplates.entityTypes && tempTemplates.entityTypes.length > 0;
  
      if (templateExists && complianceBandsExists && entityTypesExists) {
        this.setState({ 
          nerdStoreConfigData: tempTemplates, 
          tempTemplates: null, 
          showConfigModal: false, 
          templateInitialized: true, 
        }, () => {
          this.startLoadingEntityTags()
        });
      }
      else {
        this.setState({
          showConfigModal: false, 
          templateInitialized: false,
          showConfigExitMessage: true,
        });
      }

    } else {
      this.setState({ 
        showConfigModal: false, 
        templateInitialized: false, 
        showConfigExitMessage: true,
      });
    }
  }

  onUpdateTemplate = (data) => {
    // console.log(">>> main-index.updateTemplate: ", data);
    this.setState({
      tempTemplates: data,
    });
  }

  onCheckConfig = (mode) => {
    switch (mode) {
      case 'enter':
        this.setState({
          showConfigEntryMessage: false,
        });
        break;
      case 'reconfig':
        this.setState({
          showConfigExitMessage: false,
          showConfigModal: true,
        });
        break;
      }
  }

  render() {
    const {
      nerdStoreError,
      nerdStoreErrorMessages,
      configErrors,
      entityLoading, 
      entityCount, 
      loadedEntities, 
      nerdGraphEntityData,
      nerdStoreConfigData,
      user,
      accounts,
      userLoading,
      templateLoading,
      showConfigModal,
      showConfigEntryMessage,
      showConfigExitMessage,
    } = this.state

    const modalStyle = { width: '90%', height: '90%' };

    if (nerdStoreError) {
      // show nerdStoreErrorMessages
      return <div className="config__popup__message">
            <center><h1>NerdStore Access Error!</h1></center>
            <br/>
            <ul style={{padding: '20px', margin: '20px'}}>
            {nerdStoreErrorMessages.map(errMsg => {
              return <li key={errMsg}>{errMsg}</li>
            })}
            </ul>
            <br/>
            <center><h2>Please correct the issuse{nerdStoreErrorMessages.length>1 ? 's' : ''} and restart this nerdlet</h2></center>
            <br/>
          </div>
    }
    else if (userLoading || templateLoading) {
      return (<Spinner />);
    }
    else {
      if (!templateLoading) {
        if (showConfigEntryMessage) {
          return <div className="config__popup__message">
            <center><h1>{configErrors.length === 3 ? 'No' : 'Incomplete'} Configuration Data Found</h1></center>
            <br/>
            <center><h2>Please enter configuration information for the following section(s):</h2></center>
            <br/>
            <ul style={{padding: '20px', margin: '20px'}}>
            {configErrors.map(configMessage => {
              return <li key={configMessage}>{configMessage}</li>
            })}
            </ul>
            <br/>
            <center>
              <Button className="config_message_button" sizeType={Button.SIZE_TYPE.MEDIUM} type={Button.TYPE.PRIMARY} onClick={() => {this.onCheckConfig('enter')}}>OK</Button>
            </center>
          </div>
        }
        else if (showConfigModal) {
          return (
            <Modal style={modalStyle} onClose={this.onCloseConfig}>
              <Config accounts={accounts} user={user} onUpdate={this.onUpdateTemplate} />
            </Modal>
          )
        }
        else if (showConfigExitMessage) {
          return <div className="config__popup__message">
            <center><h1>Config Data Not Completed</h1></center>
            <br/>
            <center><h2>Please complete the configuration before you could continue to the next step</h2></center>
            <br/>
            <center>
              <Button className="config_message_button" style={{marginLeft: "50px"}} sizeType={Button.SIZE_TYPE.MEDIUM} type={Button.TYPE.NORMAL} onClick={() => {this.onCheckConfig('reconfig')}}>OK</Button>
            </center>
          </div>
        }
        else {
          return (
            <>
              {entityLoading ? 
                <HeadingText type={HeadingText.TYPE.HEADING_4}>
                  Loading tags... ({loadedEntities} / {entityCount} entities examined)
                </HeadingText>
              : 
                <Entities
                  nerdGraphEntityData={nerdGraphEntityData}
                  user={user}
                  userAccount={helpers.masterAccountId}
                  accounts={accounts}
                  nerdStoreConfigData={nerdStoreConfigData}
                />
              }
            </>
          );
        }
      }
    }
  }
}
