import React from 'react';
import { Alert, View, Text, SafeAreaView, StyleSheet } from 'react-native';
import TableContainer from '_src/containers/TableContainer';
import Loading from '_src/components/Loading';
import store from '_src/utils/store';
import relationshipToObject from '_src/utils/relationshipToObject';
import formatDate from '_src/utils/formatDate';

import Logger from '_src/logger';
const logger = new Logger('FieldTasksPage');

const columns = [
  {
    header: {
      label: '任务类型',
      attribute: 'category_label'
    },
    flex: 1,
  },
  {
    header: {
      label: '状态',
      attribute: 'status_label',
    },
    flex: 1,
  },
  {
    header: {
      label: '酒店名字',
      attribute: 'organisation_name',
    },
    flex: 1,
  },
  {
    header: {
      label: '来源',
      attribute: 'source_label',
    },
    flex: 1,
  },
  {
    header: {
      label: '发布时间',
      attribute: 'created_at',
    },
    flex: 1,
    render: (resource) => <Text style={styles.cell}>{formatDate(resource.attributes.created_at)}</Text>
  },
];

export default class FieldTasksPage extends React.Component {
  state = {
    userId: ''
  }

  async componentDidMount() {
    const userId = await store.getUserId();
    this.setState({userId});
  }

  render() {
    const { userId } = this.state;
    if (!userId) {
      return <></>;
    }
    return (
      <View style={style}>
        <View style={styles.container}>
          <TableContainer
            collectionPath={`/api/v1/field_tasks?filter[user_id]=${userId}&filter[is_active]=true`}
            columns={columns}
          />
        </View>
      </View>
    );
  }
}

const style = {
  alignItems: 'center',
  justifyContent: 'flex-start',
  height: '100%',
  width: '100%',
  backgroundColor: '#fff',
};
const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginHorizontal: 20,
    padding: 20,
  },
  text: {
    fontSize: 42,
  },
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    padding: 5
  },
  error: {
    margin: 5,
    color: 'red'
  }
});

