import React from 'react';
import PropTypes from 'prop-types';

const TagListing = ({ type, tags }) => {
  const getStatus = (values) => {
    const hasValue = values && values.find((v) => v !== '<undefined>');
    if (hasValue) return 'high__band';
    if (type === 'mandatory' && !hasValue) return 'low__band';
    if (type === 'optional' && !hasValue) return 'mid__band';
  };

  return (
    <div>
      <label className="tags__title">{type}</label>
      <div className="tags__list">
        {tags.map((tag, idx) => {
          return (
            <label
              key={idx}
              className={`tags__tag ${getStatus(tag.tagValues)}`}
            >
              {`${tag.tagKey}: ${tag.tagValues.join(', ')}`}
            </label>
          );
        })}
      </div>
    </div>
  );
};

TagListing.propTypes = {
  type: PropTypes.string.isRequired,
  tags: PropTypes.array.isRequired,
};

export default TagListing;
