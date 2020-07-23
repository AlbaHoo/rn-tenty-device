import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Text,
} from 'react-native';

function Row({item, columns, included}) {
  const {id, title} = item;
  if (!columns || !item) {
    return <></>;
  }
  return (
    <View style={[styles.rowContainer]}>
      {columns.map((c, i) => <Cell key={i} column={c} resource={item} included={included}/>)}
    </View>
  );
}

function Cell({column, resource, included}) {
  const { header, flex, render } = column;
  if (render) {
    return <View style={{flex: flex}}>{render(resource, included)}</View>;
  } else {
    return (
      <View style={{flex: flex}}>
        <Text style={styles.cell}>{resource?.attributes ? resource.attributes[header.attribute] : ''}</Text>
      </View>
    );
  }
}

class Table extends Component {
  render() {
    const { list, columns, included } = this.props;
    return (
      <View style={styles.table}>
        <View style={[styles.headerContainer]}>
          {columns.map((c, i)=> <View key={i} style={{flex: c.flex}}><Text style={styles.header}>{c.header.label}</Text></View>)}
        </View>
        <View style={styles.detailsContainer}>
          <FlatList
            data={list}
            renderItem={({ item }) => (
              <Row item={item} columns={columns} included={included}/>
            )}
            keyExtractor={item => item.id}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  table: {
    paddingBottom: 100,
  },
  rowContainer: {
    display: 'flex',
    flexDirection: 'row',
    padding: 10
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: 'black'
  },
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    padding: 5
  },
  header: {
    fontSize: 16,
    padding: 5,
    fontWeight: 'bold',
  },
  detailsContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  item: {
    width: '100%',
    padding: 30,
    display: 'flex',
    flexDirection: 'row'
  },
  itemText: {
    flex: 1,
    fontSize: 18,
  }
});

export default Table;
