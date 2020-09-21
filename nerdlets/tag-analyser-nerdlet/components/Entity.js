import React, { Component } from "react";


class Entity extends Component {
  
  render() {
    // let _this = this
    const tagStyle = {
      fontSize: "16px",
      fontWeight: "bold",
      border: "4px solid black",
      borderRadius: "10px",
      margin: "15px 15px",
      padding: "8px",
      // color: "black",
      // color: "#F5DEB3", 
      // color: "navajowhite",
      color: "white",
    }
    const color = {
      mandatorySuccess: "SEAGREEN",
      mandatoryFail: "ORANGERED",
      optionalSuccess: "MEDIUMSEAGREEN",
      optionalFail: "sandybrown",
      
    }

    return (
      <div className="split" style={{ border: "6px solid #eee" }}>
        <div
          className="left"
          style={{
            border: "1px solid #eee",
            boxShadow: "0 2px 3px #ccc",
            padding: "10px",
            margin: "10px auto",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              border: "1px solid black",
              padding: "5px",
              textIndent: "10px",
            }}
          >
            <p>Account Id: <strong>{this.props.entity.account.id}</strong></p>
            <p>Account Name: <strong>{this.props.entity.account.name}</strong></p>
            <p>Domain: <strong>{this.props.entity.domain}</strong></p>
            <p>Entity Type: <strong>{this.props.entity.entityType}</strong></p>
            <p>Entity Name: <strong>{this.props.entity.name}</strong></p>
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
              {this.props.entity.mandatoryTags.map(tag => {
                return (
                  <div
                        style={{
                          ...tagStyle, 
                          backgroundColor: tag.tagValues[0] === "<undefined>" 
                            ? color.mandatoryFail 
                            : color.mandatorySuccess,
                        }}
                        key={this.props.entity.guid + "_" + tag.tagKey}
                    >
                        {tag.tagKey + ": " + tag.tagValues.join(", ")}
                    </div>
                  )
                })
              }
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
              {this.props.entity.optionalTags.map(tag => {
                return (
                  <div
                  style={{
                    ...tagStyle, 
                    backgroundColor: tag.tagValues[0] === "<undefined>" 
                    ? color.optionalFail 
                    : color.optionalSuccess,

                  }}
                  key={this.props.entity.guid + "_" + tag.tagKey}
                    >
                        {tag.tagKey + ": " + tag.tagValues.join(", ")}
                    </div>
                  )
                })
              }
            </div>

        </div>
      </div>
    );
  }
}

export default Entity;
