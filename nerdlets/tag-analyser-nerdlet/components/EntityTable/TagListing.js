/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';

const TagListing = ({ type, tags }) => {
  const passes = []
  const fails = []

  tags.forEach(tag => {
    const hasValue = tag.tagValues && tag.tagValues.find((v) => v !== '<undefined>');
    if (hasValue) {
      tag.status = 'high__band';
      passes.push(tag);
    }
    if (type === 'mandatory' && !hasValue) {
      tag.status = 'low__band';
      fails.push(tag);
    }
    if (type === 'optional' && !hasValue) {
      tag.status = 'mid__band';
      fails.push(tag);
    }
  });

  const renderTags = (typedTags) => {
    return (
      <>
        {typedTags.map((tag, idx) => {
          return (
            <React.Fragment key={idx}>
              <div className={`tags__tag ${tag.status}`}>
                <label className="tags__tag__status">{`${tag.status === 'high__band'
                ? '✓'
                : tag.status === 'mid__band'
                  ? '⚠️'
                  : 'X'
              }`}</label>
                <label>{`${tag.tagKey}: ${tag.tagValues.join(', ')}`}</label>
              </div>
            </React.Fragment>
          );
        })}
      </>
    )
  }

  return (
    <div>
      <label className="tags__title">{type}</label>
      <div className="tags__list">
        {renderTags(fails)}
        {renderTags(passes)}
      </div>
    </div>
  );
};

TagListing.propTypes = {
  type: PropTypes.string.isRequired,
  tags: PropTypes.array.isRequired,
};

export default TagListing;
