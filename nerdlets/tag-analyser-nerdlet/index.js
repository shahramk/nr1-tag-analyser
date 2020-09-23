import React from "react";
import { Icon, HeadingText, NerdGraphQuery, Spinner } from "nr1";

import Entities from "./components/Entities";
import { entityTypes, mandatoryTagRules, optionalTagRules } from "./utils/tag-schema"; // SK


export default class TagVisualizer extends React.Component {
  state = {
    tagHierarchy: {
      entities: [],
      accounts: {}, // SK -- {},
      entityTypes: {},
    },
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

    // const entityData = JSON.stringify(tagHierarchy)
    return (
      <>
        {doneLoading ? null : (
          <HeadingText type={HeadingText.TYPE.HEADING_4}>
            Loading tags... ({loadedEntities} / {entityCount} entities examined)
          </HeadingText>
        )}
          <Entities
            tagHierarchy={tagHierarchy}
            entityCount={entityCount}
            loadedEntities={loadedEntities}
            doneLoading={doneLoading}
            mandatoryTags={this.state.mandatoryTags}
          />
        
      </>
    );
  }

  startLoadingEntityTags = () => {
    // reset all cached state and then fetch the first page of entity results...
    const { loadEntityBatch } = this;

    this.setState(
      {
        tagHierarchy: {
          entities: [],
          accounts: {}, // SK -- {},
          entityTypes: {},
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
    this.processLoadedEntities(entities); // SK

    this.setState(
      {
        queryCursor: nextCursor,
        entityCount,
        loadedEntities: loadedEntities + entities.length,
        doneLoading: !nextCursor,
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
      entity.complianceScore = compliance / mandatoryTagRules.length; // against all mandatory tags

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

      
      const domain = entity.domain
      if (!tagHierarchy.entityTypes[domain]) tagHierarchy.entityTypes[domain] = []
      tagHierarchy.entityTypes[domain].push(entity.guid)

    });

    return tagHierarchy;
  };

}
