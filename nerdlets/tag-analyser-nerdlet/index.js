import React from "react";
import { Icon, HeadingText, NerdGraphQuery, Spinner } from "nr1";

import Entities from "./components/Entities";

import { 
  entityTypes, 
  mandatoryTagRules, 
  optionalTagRules, 
  complianceBands,
} from "../shared/utils/tag-schema"; // SK
import { 
  getAccountCollection, 
  getDate, 
  writeAccountDocument,
} from "../shared/utils/helpers"; // SK


export default class TagAnalyser extends React.Component {
  state = {
    userAccount: 192626,
    user: {},
    nerdStoreCollection: "tagAnalyserCollection",
    nerdStoreDocument: "tagAnalyserDocument",
    tagHierarchy: {
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

    nerdStoreConfigData: {},
 };

  static config = {
    hasTagFilterBar: false,
    timePicker: {
      isEnabled: false,
    },
  };

  componentDidMount() {

    this.startLoadingEntityTags();
  }

  render() {
    const {doneLoading, entityCount, loadedEntities, tagHierarchy} = this.state

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

    return (
      <>
        {doneLoading ? null : (
          <HeadingText type={HeadingText.TYPE.HEADING_4}>
            Loading tags... ({loadedEntities} / {entityCount} entities examined)
          </HeadingText>
        )}
          <Entities
            tagHierarchy={tagHierarchy}
            user={this.state.user}
            userAccount={this.state.userAccount}
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
        tagHierarchy: {
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

        nerdStoreConfigData: {},
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
      queryString: "domain in ("  +  entityTypes.join(", ")  +  ")",
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
      state: { loadedEntities, tagHierarchy },
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
      }
    );
  };

  processLoadedEntities = (entities) => {
    const { tagHierarchy } = this.state;

    entities.forEach((entity) => {
      // get all the tags
      const { tags } = entity;
      entity.mandatoryTags = [];
      entity.optionalTags = [];

      // set mandatory tags for entity
      let compliance = 0;
      mandatoryTagRules.forEach(rule => {
        const t = tags.find(tag => tag.tagKey === rule.key)
        // const v = typeof(t) === "object" ? t.tagValues : ["<undefined>"]
        let v = ["<undefined>"];
        if (typeof(t) === "object") {
          v = t.tagValues;
          compliance += 1;
        }
        entity.mandatoryTags.push({ tagKey: rule.key, tagValues: v });
      });
      entity.complianceScore = compliance / mandatoryTagRules.length * 100; // against all mandatory tags

      // set optional tags for entity
      optionalTagRules.forEach(rule => {
        const t = tags.find(tag => tag.tagKey === rule.key)
        const v = typeof(t) === "object" ? t.tagValues : ["<undefined>"]
        entity.optionalTags.push({ tagKey: rule.key, tagValues: v });
      });
      tagHierarchy.entities.push(entity)

      const acctId = /*'rpm-' +*/ entity.account.id.toString()
      if (!tagHierarchy.accounts[acctId]) tagHierarchy.accounts[acctId] = []
      tagHierarchy.accounts[acctId].push(entity.guid)

      if ( typeof(tagHierarchy.accountList.find(item => item.id.toString() === acctId)) === "undefined" ) {
        tagHierarchy.accountList.push({
          id: entity.account.id,
          key: tagHierarchy.accountList.length, 
          value: `${entity.account.id}: ${entity.account.name}`, 
          text: entity.account.name,
        });
      }

      
      const domain = entity.domain
      if (!tagHierarchy.entityTypes[domain]) tagHierarchy.entityTypes[domain] = []
      tagHierarchy.entityTypes[domain].push(entity.guid)

    });

    return tagHierarchy;
  };

}
