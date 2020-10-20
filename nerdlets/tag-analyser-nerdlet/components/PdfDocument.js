import React from 'react';
import PropTypes from 'prop-types';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';

import helpers from '../../shared/utils/helpers';

export function PdfDocument(props) {
  Font.register({
    family: 'Oswald',
    src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf',
  });

  const styles = StyleSheet.create({
    page: {
      backgroundColor: '#ffffff',
      padding: 20,
      fontFamily: 'Oswald',
    },
    pageNumber: {
      position: 'absolute',
      fontSize: 8,
      bottom: 10,
      left: 0,
      right: 10,
      textAlign: 'right',
      color: 'grey',
    },
    header: {
      fontSize: 15,
      paddingTop: 5,
      paddingBottom: 1,
      textAlign: 'left',
    },
    subheader: {
      fontSize: 6,
      paddingBottom: 10,
      textAlign: 'left',
    },
    metadata: {
      fontSize: 10,
      textAlign: 'left',
      paddingBottom: 2,
    },
    tableHeader: {
      fontSize: 10,
      backgroundColor: '#edeeee',
      border: '1 solid grey',
    },
    tableRow: {
      borderRight: '1 solid grey',
      borderLeft: '1 solid grey',
      borderBottom: '1 solid grey',
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      flexGrow: 0,
      width: '100%',
    },
    col: {
      flexGrow: 1,
      textOverflow: 'ellipsis',
      fontSize: 8,
      textAlign: 'left',
      paddingLeft: 2,
      paddingVertical: 2,
    },
    accountCol: {
      width: '20%',
      borderRight: '1 solid grey',
    },
    typeCol: {
      width: '8%',
      borderRight: '1 solid grey',
    },
    nameCol: {
      width: '22%',
      borderRight: '1 solid grey',
    },
    scoreCol: {
      width: '8%',
      borderRight: '1 solid grey',
    },
    tagsMandatoryCol: {
      width: '21%',
      borderRight: '1 solid grey',
    },
    tagsOptionalCol: {
      width: '21%',
    },
    tagBlock: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-around',
      flexWrap: 'wrap',
      fontSize: 8,
    },
    tag: {
      paddingBottom: 1,
    },
  });

  const getMissing = (tags) => {
    const filteredTags = [];
    tags.forEach((t) => {
      t.tagValues &&
        t.tagValues.forEach((v) => {
          if (v === '<undefined>') filteredTags.push(t);
        });
    });
    return filteredTags;
  };

  return (
    <Document>
      <Page style={styles.page}>
        <View fixed style={styles.pageNumber}>
          <Text
            fixed
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
          />
        </View>

        <View>
          <Text break style={styles.header}>
            Tag Compliance Report
          </Text>
          <Text break style={styles.subheader}>
            Generated: {Date().toLocaleString()}
          </Text>
          <Text style={styles.metadata}>Account(s): {props.accounts}</Text>
          <Text style={{ ...styles.metadata, paddingBottom: 15 }}>
            Additional Scope: {props.filters}
          </Text>
        </View>

        <View fixed style={styles.tableHeader}>
          <View style={styles.row}>
            <Text
              key="account_id"
              style={{ ...styles.col, ...styles.accountCol }}
            >
              Account
            </Text>
            <Text key="domain" style={{ ...styles.col, ...styles.typeCol }}>
              Type
            </Text>
            <Text
              key="entity_name"
              style={{ ...styles.col, ...styles.nameCol }}
            >
              Name
            </Text>
            <Text
              key="compliance_score"
              style={{ ...styles.col, ...styles.scoreCol }}
            >
              Score
            </Text>
            <Text
              key="mandatoryTags"
              style={{ ...styles.col, ...styles.tagsMandatoryCol }}
            >
              Missing Mandatory Tags
            </Text>
            <Text
              key="optionalTags"
              style={{ ...styles.col, ...styles.tagsOptionalCol }}
            >
              Missing Optional Tags
            </Text>
          </View>
        </View>

        {props.data &&
          props.data.map((entity) => {
            return (
              <>
                <View key={entity.guid} wrap={false} style={styles.tableRow}>
                  <View key={`${entity.guid}_${entity.name}`} style={styles.row}>
                    <Text
                      key={`${entity.guid}_1`}
                      style={{ ...styles.col, ...styles.accountCol }}
                    >
                      {entity.account.id}: {entity.account.name}
                    </Text>
                    <Text
                      key={`${entity.guid}_2`}
                      style={{ ...styles.col, ...styles.typeCol }}
                    >
                      {entity.domain}
                    </Text>
                    <Text
                      key={`${entity.guid}_3`}
                      style={{ ...styles.col, ...styles.nameCol }}
                    >
                      {entity.name}
                    </Text>
                    <Text
                      key={`${entity.guid}_4`}
                      style={{
                        ...styles.col,
                        ...styles.scoreCol,
                        color: helpers.setComplianceColor(entity.complianceScore, props.complianceBands),
                      }}
                    >
                      {`${entity.complianceScore.toFixed(2)}%`}
                    </Text>
                    <View
                      key={`${entity.guid}_5`}
                      style={{ ...styles.col, ...styles.tagsMandatoryCol }}
                    >
                      {getMissing(entity.mandatoryTags) && (
                        <>
                          {getMissing(entity.mandatoryTags).map((tag, i) => {
                            return (
                              <Text
                                key={`${entity.guid}_5_${tag.tagKey}_${i.toString()}`}
                                style={styles.tag}
                              >
                                {tag.tagKey}
                              </Text>
                            );
                          })}
                        </>
                      )}
                    </View>
                    <View
                      key={`${entity.guid}_6`}
                      style={{ ...styles.col, ...styles.tagsOptionalCol }}
                    >
                      {getMissing(entity.optionalTags) && (
                        <>
                          {getMissing(entity.optionalTags).map((tag, i) => {
                            return (
                              <Text
                                key={`${entity.guid}_6_${ tag.tagKey }_${i.toString()}`}
                                style={styles.tag}
                              >
                                {tag.tagKey}
                              </Text>
                            );
                          })}
                        </>
                      )}
                    </View>
                  </View>
                </View>
              </>
            );
          })}
      </Page>
    </Document>
  );
}

PdfDocument.propTypes = {
  data: PropTypes.array.isRequired,
  accounts: PropTypes.string.isRequired,
  complianceBands: PropTypes.object.isRequired,
  filters: PropTypes.string.isRequired,
}