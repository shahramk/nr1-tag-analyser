import React from 'react';
import PropTypes from 'prop-types';

import { Table } from 'semantic-ui-react';
import { complianceBands } from '../../../shared/utils/tag-schema';
import TagListing from './TagListing';

const EntityTable = ({ entities }) => {
  const getBand = (score) => {
    if (score >= complianceBands.highBand.lowerLimit) return 'high__band';
    else if (
      complianceBands.midBand.lowerLimit <= score &&
      score < complianceBands.midBand.upperLimit
    )
      return 'mid__band';
    else return 'low__band';
  };

  return (
    <div className="entity__table__panel">
      <Table compact celled style={{ margin: 0 }}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Account</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Score</Table.HeaderCell>
            <Table.HeaderCell>Tags</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {entities &&
            entities.map((entity, idx) => {
              return (
                <Table.Row key={idx}>
                  <Table.Cell width="3">{entity.account.name}</Table.Cell>
                  <Table.Cell width="1">{entity.domain}</Table.Cell>
                  <Table.Cell width="3">{entity.name}</Table.Cell>
                  <Table.Cell
                    width="1"
                    textAlign="center"
                    className={`score ${getBand(entity.complianceScore)}`}
                  >
                    {`${entity.complianceScore.toFixed(2)}%`}
                  </Table.Cell>
                  <Table.Cell>
                    <TagListing type="mandatory" tags={entity.mandatoryTags} />
                    <TagListing type="optional" tags={entity.optionalTags} />
                  </Table.Cell>
                </Table.Row>
              );
            })}
        </Table.Body>
      </Table>
    </div>
  );
};

EntityTable.propTypes = {
  entities: PropTypes.array.isRequired,
};

export default EntityTable;
