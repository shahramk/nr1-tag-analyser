import React from "react";
import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";


const unusedStyles = StyleSheet.create({
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  entityText: {
    fontSize: 10
  },
  entityTagContainer: {
    backgroundColor: "#f6f6f5",
    display: "flex",
    flexDirection: "row",
    padding: 5
  },
  image: {
    height: 20,
    width: 20
  },
  date: {
    fontSize: 11,
    // fontFamily: 'Lato Italic',
  },
  subtitle: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    width: 150,
    alignItems: "center",
    marginBottom: 12
  },
  detailLeftColumn: {
    flexDirection: 'column',
    marginLeft: 10,
    marginRight: 10,
  },
  detailRightColumn: {
    flexDirection: 'column',
    flexGrow: 9,
  },
  leftColumn: {
    flexDirection: 'column',
    flexGrow: 9,
  },
  rightColumn: {
    flexDirection: 'column',
    flexGrow: 1,
    alignItems: 'flex-end',
    justifySelf: 'flex-end',
  },
  tagsRow: { 
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 0,
    flexWrap: 'wrap',
    width: '100%',
    paddingLeft: '15px',
    paddingRight: '15px',
    textAlign: 'right'
  },
  tagsRowLeft: { 
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 0,
    flexWrap: 'wrap',
    width: '70%',
    paddingLeft: '15px',
    paddingRight: '15px',
    textAlign: 'right'
  },
  tagsCol: {
    flexGrow: 1,
    // textOverflow: 'ellipsis',
    paddingRight: '20px',
    textAlign: 'center',
    // border: '2 solid black',
    margin: 5,
  },
  split: {
    // height: '100%',
    width: '100%',
    position: 'fixed',
    zIndex: 1,
    overflowX: 'hidden',
  },
  left: {
    display: 'flex',
    left: 0,
    width: '49%',
    flexWrap: 'wrap',
    textOverflow: 'ellipsis',
    // paddingRight: '40px',
    // marginRight: '40px',
  },
  right: {
    // display: 'flex',
    // these 4 from luke's resume
    // flexDirection: 'column',
    // flexGrow: 4,
    alignItems: 'flex-end',
    // justifySelf: 'flex-end',
    right: 0,
    width: '49%',
    textOverflow: 'ellipsis',
    // flexWrap: 'wrap',
    // paddingRight: '40px',
    // marginRight: '40px',
  },
});


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

const setEntityComplianceColor = (entityComplianceScore => {
    if (entityComplianceScore*100 >= 90)
      return "seagreen";
    else if (entityComplianceScore*100 > 70)
      return "sandybrown";
    else
      return "orangered";
})

const setTagComplianceColor = ((tagValues, category) => {
    return tagValues[0] !== "<undefined>" ? "seagreen": category === "mandatory" ? "orangered" : "sandybrown";
})

export function PdfDocument(props) {
    // props.data === current active entities in the UI
    console.log("pdf props", props.data);
    const tagMinHeight = Math.max(props.data[0].mandatoryTags.length, props.data[0].optionalTags.length) * 20; // height in pixels

    return (
        <Document>
            <Page style={styles.page}>
                <View style={styles.pageNubers} fixed>
                    <Text render={({ pageNumber, totalPages }) => (
                        `${pageNumber} / ${totalPages}`
                    )} fixed />
                    
                    <View>
                        <Text> </Text><Text> </Text>
                        <Text style={{fontSize: 24, textAlign: "center", }}>Entity Mandatory Tag Compliance Report</Text>
                        <Text style={{fontSize: 24, textAlign: "center", }}>______________________________________</Text>
                        <Text style={{fontSize: 10, textAlign: 'center'}}>Report Date: {Date().toLocaleString()}</Text>
                        <Text> </Text>
                        <Text style={{fontSize: 12, textAlign: 'left'}}>Entity Count: {props.data.length} | Accounts: ({props.accounts}) | Filters: ({props.filters})</Text>
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
                    <View>
                        <Text> </Text>
                    </View>
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
                                        <Text key={entity.guid+"_4"} style={{...styles.col, width: '13%', textAlign: 'right', color: setEntityComplianceColor(entity.complianceScore)}}>{(entity.complianceScore*100).toFixed(2) + "%"}</Text>
                                    </View>
                                    <Text style={{display: 'block', textAlign: 'center'}}> </Text>
                                    <View style={styles.splitScreen} wrap={false}>
                                        <View style={{...styles.leftSide, minHeight: tagMinHeight}}>
                                            <Text style={{fontSize: 16, fontWeight: 'bold', height: 30, textAlign: 'center', paddingTop: 5, backgroundColor: 'lightgray', border: '1 solid black'}}>Mandatory Tags</Text>
                                                {entity.mandatoryTags.map((tag, i) => {
                                                    return (
                                                        <>
                                                        <Text 
                                                        key={entity.guid+"_"+tag.tagKey+"_100"+ i.toString()} 
                                                        style={{fontSize: 12, paddingLeft: 10, color: setTagComplianceColor(tag.tagValues, "mandatory")}}
                                                        >
                                                            <Text style={styles.bulletPoint}>• </Text>{tag.tagKey + ": " + tag.tagValues.join(", ")}</Text>
                                                        </>
                                                    )
                                                })}
                                        </View>
                                        <View style={{...styles.rightSide, minHeight: tagMinHeight}}>
                                            <Text style={{fontSize: 16, fontWeight: 'bold', height: 30, textAlign: 'center', paddingTop: 5, backgroundColor: 'lightgray', border: '1 solid black'}}>Optional Tags</Text>
                                                {entity.optionalTags.map((tag, i) => {
                                                    return (
                                                        <>
                                                        <Text 
                                                        key={entity.guid+"_"+tag.tagKey+"_200"+ i.toString()} 
                                                        style={{fontSize: 12, paddingLeft: 10, color: setTagComplianceColor(tag.tagValues, "optional")}}
                                                        >
                                                            <Text style={styles.bulletPoint}>• </Text>{tag.tagKey + ": " + tag.tagValues.join(", ")}</Text>
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