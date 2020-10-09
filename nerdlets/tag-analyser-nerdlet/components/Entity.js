import React, { Component } from "react";

import { setComplianceColor, tagOutput, tagStyle } from "../utils/tag-schema";

class Entity extends Component {

  addTags(tagCategory, entityGuid, entityTags) {
    return entityTags.map(tag => {
      return (
        <div
          style={{
            ...tagStyle,
            // instead of changing text color add icons for success / fail / warning
            // color: tag.tagValues[0] === "<undefined>" 
            //   ? tagOutput[tagCategory].failureColor
            //   : tagOutput[tagCategory].successColor
            color: "black",
          }}
          key={entityGuid + "_" + tag.tagKey}
        >
          <img src={tag.tagValues[0] === "<undefined>" ? tagOutput[tagCategory].failureIcon : tagOutput[tagCategory].successIcon} style={{ width: "15px", height: "15px", verticalAlign: "center" }}></img>
          {" " + tag.tagKey + ": " + tag.tagValues.join(", ")}
        </div>
      )
    })
  }

  render() {
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
          <div>
            <table
              style={{ width: "99%", }}>
              <tbody>
                <tr>
                  <th style={{ width: "20%", fontSize: "16px", textAlign: "center", }}>
                    <strong>{entity.account.id}</strong>
                  </th>
                  <th style={{ width: "22%", fontSize: "16px", textAlign: "center", }}>
                    <strong>{entity.domain}</strong>
                  </th>
                  <th style={{ width: "40%", fontSize: "16px", textAlign: "center", }}>
                    <strong>{entity.name}</strong>
                  </th>
                  <th style={{ width: "8%", fontSize: "16px", textAlign: "center", color: setComplianceColor(entity.complianceScore) }}>
                    <strong>{(entity.complianceScore).toFixed(2) + "%"}</strong>
                  </th>
                </tr>
              </tbody>
            </table>

          </div>
        </div>

        <div className="right">
          <div style={{
            display: "flex",
            flexFlow: "row wrap",
            margin: "7px 4px",
          }}>
            <h3 style={{ textDecoration: "underline" }}>Mandatory Tags</h3>
            {this.addTags("mandatory", entity.guid, entity.mandatoryTags)}
          </div>

          <hr></hr>

          <div style={{
            display: "flex",
            flexFlow: "row wrap",
            margin: "7px 4px",
          }}>
            <h3 style={{ textDecoration: "underline" }}>Optional Tags</h3>
            {this.addTags("optional", entity.guid, entity.optionalTags)}
          </div>

        </div>
      </div>
    );
  }
}

export default Entity;
