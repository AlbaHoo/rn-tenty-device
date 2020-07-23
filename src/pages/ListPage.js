import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Text,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import TableContainer from '_src/containers/TableContainer';
import formatDate from '_src/utils/formatDate';

const columns = [
  {
    header: {
      label: '日期',
      attribute: 'created_at'
    },
    flex: 2,
    render: (resource) => <Text style={styles.cell}>{formatDate(resource.attributes.created_at)}</Text>
  },
  {
    header: {
      label: '配件',
      attribute: 'summary'
    },
    flex: 3,
    render: (resource) => <Text style={styles.cell}>{resource.attributes.summary}</Text>
  },
  {
    header: {
      label: '备注',
      attribute: 'description'
    },
    flex: 3,
    render: (resource) => <Text style={styles.cell}>{resource.attributes.description}</Text>
  },
  {
    header: {
      label: '负责人',
      attribute: 'user'
    },
    flex: 1,
    render: (resource) => <Text style={styles.cell}>{resource.attributes.user}</Text>
  },
];

class ListPage extends Component {
  render() {
    const { deviceId } = this.props;
    const path = deviceId
      ? `/api/v1/repair_records?filter[device_id]=${deviceId}`
      : '/api/v1/repair_records';

    return (
      <View style={styles.container}>
        <TableContainer
          collectionPath={path}
          columns={columns}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: '#f1f1f1',
    width: '100%',
    height: '100%',
  },
  cell: {
    fontSize: 16
  },
});

export default ListPage;
