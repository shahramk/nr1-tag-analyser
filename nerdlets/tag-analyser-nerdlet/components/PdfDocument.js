import React from "react";
import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";

import { setComplianceColor , setTagComplianceColor, tagOutput } from "../../shared//utils/tag-schema";


const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff"
  },
  pageNumbers: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    fontSize: 12,
    textAlign: 'center',
  },

  item: {
    flexDirection: 'row',
    // marginBottom: 5,
  },
  image: {
    width: 10, 
    height: 10, 
    verticalAlign: "center",
  },

  bulletPoint: {
    width: 10,
    fontSize: 12,
    paddingLeft: 10,
  },
  itemContent: {
    flex: 1,
    fontSize: 10,
    // fontFamily: 'Lato',
    paddingLeft: 10,
  },
  // Amit -------------------------
  row: { 
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 0,
    flexWrap: 'wrap',
    width: '100%',
    paddingLeft: '15px',
    paddingRight: '15px'
  },
  col: {
    flexGrow: 1,
    textOverflow: 'ellipsis',
    paddingRight: '20px',
    // width: '25%'
  },
  // Amit =======================================
  // Amit =======================================

  splitScreen: {
    width: '90%',
    position: 'flex',
    margin: 'auto',
  },
  leftSide: {
    position: 'flex',
    width: '49%',
    border: '1 solid black',
    left: 0,
    textOverflow: 'ellipsis',
  },
  rightSide: {
    position: 'absolute',
    width: '49%',
    border: '1 solid black',
    right: 0,
    textOverflow: 'ellipsis',
  },
});

export function PdfDocument(props) {
    // props.data === current active entities in the UI
    console.log("pdf props", props.data);
    const tagMinHeight = Math.max(props.data[0].mandatoryTags.length, props.data[0].optionalTags.length) * 18; // height in pixels

    return (
        <Document>
          <Page style={styles.page}>
            <View style={styles.pageNumber} fixed>
              <Text render={({ pageNumber, totalPages }) => (`${pageNumber} / ${totalPages}`)} fixed/>
            </View>

            <View>
              <Text> </Text><Text> </Text>
              <Text style={{fontSize: 24, textAlign: "center", }}>Entity Mandatory Tag Compliance Report</Text>
              <Text style={{fontSize: 24, textAlign: "center", }}>______________________________________</Text>
              <Text style={{fontSize: 10, textAlign: 'center'}}>Report Date: {Date().toLocaleString()}</Text>
              {/* <Text> </Text> */}
              <Text style={{fontSize: 10, textAlign: 'left', margin: "5px"}}>Entity Count: ({props.data.length}) | Accounts: ({props.accounts}) | Filters: ({props.filters})</Text>
            </View>

            <View style={{
              fontSize: 15, 
              fontWeigth: 'bold', 
              border: '2 solid black', 
              backgroundColor: 'gray',
              marginLeft: 2,
              marginRight: 2,
              }}>
              <View style={styles.row}>
                <Text key={"account_id"} style={{...styles.col, width: '14%'}}>{"Account ID"}</Text>
                <Text key={"domain"} style={{...styles.col, width: '18%'}}>{"Domain"}</Text>
                <Text key={"entity_name"} style={{...styles.col, width: '48%'}}>{"Name"}</Text>
                <Text key={"compliance_score"} style={{...styles.col, width: '20%', textAlign: 'right'}}>{"Compliance Score %"}</Text>
              </View>
            </View>

            <View fixed>
              <Text> </Text>
            </View>

            <View style={{
              fontSize: 15, 
              fontWeigth: 'bold', 
              boder: '1 solid box',
              minHight: 150,
              margin: 2,
              padding: 2,
              }}
              >
              {props.data
                ? props.data.map((entity, index) => {
                    return(
                      <>
                        <View  wrap={false}>
                          <View  key={entity.guid} style={styles.row}>
                            <Text key={entity.guid+"_1"} style={{...styles.col, width: '14%'}}>{entity.account.id}</Text>
                            <Text key={entity.guid+"_2"} style={{...styles.col, width: '18%'}}>{entity.domain}</Text>
                            <Text key={entity.guid+"_3"} style={{...styles.col, width: '55%'}}>{entity.name}</Text>
                            <Text key={entity.guid+"_4"} style={{...styles.col, width: '13%', textAlign: 'right', color: setComplianceColor(entity.complianceScore)}}>{(entity.complianceScore).toFixed(2) + "%"}</Text>
                          </View>
                          <Text style={{display: 'block', textAlign: 'center'}}> </Text>
                          <View style={styles.splitScreen} wrap={false}>
                              <View style={{...styles.leftSide, minHeight: tagMinHeight}}>
                                <Text style={{fontSize: 12, fontWeight: 'bold', height: 30, textAlign: 'center', paddingTop: 5, backgroundColor: 'lightgray', border: '1 solid black'}}>Mandatory Tags</Text>
                                {entity.mandatoryTags.map((tag, i) => {
                                  return (
                                    <>
                                      <Text 
                                      key={entity.guid+"_"+tag.tagKey+"_100"+ i.toString()} 
                                      // style={{fontSize: 12, paddingLeft: 10, color: setTagComplianceColor(tag.tagValues, "mandatory")}}
                                      style={{fontSize: 10, paddingLeft: 10, color: "black"}}
                                      >
                                        <Image src={tag.tagValues[0] === "<undefined>" ? tagOutput["mandatory"].failureIcon : tagOutput["mandatory"].successIcon} style={styles.image}/>
                                        {" - " + tag.tagKey + ": " + tag.tagValues.join(", ")}</Text>
                                    </>
                                  )
                                })}
                              </View>
                              <View style={{...styles.rightSide, minHeight: tagMinHeight}}>
                                <Text style={{fontSize: 12, fontWeight: 'bold', height: 30, textAlign: 'center', paddingTop: 5, backgroundColor: 'lightgray', border: '1 solid black'}}>Optional Tags</Text>
                                {entity.optionalTags.map((tag, i) => {
                                  return (
                                    <>
                                      <Text 
                                      key={entity.guid+"_"+tag.tagKey+"_200"+ i.toString()} 
                                      // style={{fontSize: 12, paddingLeft: 10, color: setTagComplianceColor(tag.tagValues, "optional")}}
                                      style={{fontSize: 10, paddingLeft: 10, color: "black"}}
                                      >
                                        <Image src={tag.tagValues[0] === "<undefined>" ? tagOutput["optional"].failureIcon : tagOutput["optional"].successIcon} style={styles.image}/>
                                        {" - " + tag.tagKey + ": " + tag.tagValues.join(", ")}</Text>
                                    </>
                                  )
                                })}
                              </View>
                          </View>
                          <Text style={{display: 'block'}}> </Text>
                          <Text style={{display: 'block'}}> </Text>
                        </View>
                      </>
                    );
                })
                : ""
              }
            </View>
          </Page>
        </Document>
    );
}