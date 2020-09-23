import React, { Component } from "react";

const tagStyle = {
  fontSize: "16px",
  fontWeight: "bold",
  border: "4px solid dimgray",
  borderRadius: "10px",
  margin: "15px 15px",
  padding: "8px",
  // color: "black",
  // color: "#F5DEB3", 
  // color: "navajowhite",
  color: "white",
}
const color = {
  mandatory: {
    success: "seagreen",
    fail: "orangered",
  },
  optional: {
    success: "mediumseagreen",
    fail: "sandybrown",
  }
}

class Entity extends Component {
  
  addTags(category, entityGuid, entityTags) {
    return entityTags.map(tag => {
      return (
        <div
              style={{
                ...tagStyle, 
                color: tag.tagValues[0] === "<undefined>" 
                  ? color[category].fail 
                  : color[category].success
              }}
              key={entityGuid + "_" + tag.tagKey}
          >
              {tag.tagKey + ": " + tag.tagValues.join(", ")}
          </div>
        )
      })
  }

  render() {
    // let _this = this
    const { key, entity } = this.props

    return (
      <div className="split" style={{ border: "3px solid silver", borderRadius: "10px", margin: "3px", }}>
        <div
          className="left"
          style={{
            border: "1px solid #eee",
            borderRadius: "10px",
            boxShadow: "0 2px 3px #ccc",
            padding: "10px",
            margin: "10px auto",
            boxSizing: "border-box",
          }}
          key={key}
        >
          <div
            style={{
              border: "2px solid black",
              borderRadius: "10px",
              padding: "5px",
              textIndent: "10px",
              fontSize: "14px",
            }}
          >
            <p style={{padding: "3px",}}>Account Id: <strong>{entity.account.id}</strong></p>
            <p style={{padding: "3px",}}>Account Name: <strong>{entity.account.name}</strong></p>
            <p style={{padding: "3px",}}>Domain: <strong>{entity.domain}</strong></p>
            <p style={{padding: "3px",}}>Entity Type: <strong>{entity.entityType}</strong></p>
            <p style={{padding: "3px",}}>Entity Name: <strong>{entity.name}</strong></p>
            <p style={{padding: "3px",}}>Compliance Score: <strong>{(entity.complianceScore*100).toFixed(2) + "%"}</strong></p>
          </div>
        </div>

        <div className="right">
            <div
              style={{
                display: "flex",
                flexFlow: "row wrap",
                margin: "7px 4px",
              }}
            >
              <h2>Mandatory Tags</h2>
              {this.addTags("mandatory", entity.guid, entity.mandatoryTags)}
            </div>

            <hr></hr>

            <div
              style={{
                display: "flex",
                flexFlow: "row wrap",
                margin: "7px 4px",
              }}
            >
              <h2>Optional Tags</h2>
              {this.addTags("optional", entity.guid, entity.optionalTags)}
            </div>

        </div>
      </div>
    );
  }
}

export default Entity;
