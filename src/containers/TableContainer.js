import React, { Component } from 'react';
import {
  Alert,
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Text,
} from 'react-native';
import Loading from '_src/components/Loading';
import Table from '_src/components/Table';
import request from '_src/utils/request';
import Logger from '_src/logger';
const logger = new Logger('TableContainer');

function Row({item, columns}) {
  const {id, title} = item;
  if (!columns || !item) {
    return <></>;
  }
  return (
    <View style={[styles.rowContainer]}>
      {columns.map(c => <View style={{flex: c.flex}} >{c.render(item)}</View>)}
    </View>
  );
}

class TableContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      items: [],
      included: []
    }
  }

  async componentDidMount() {
    const { collectionPath } = this.props;
    logger.info(collectionPath, 'componentDidMount');
    if (!collectionPath) {
      return;
    }
    this.setState({loading: true}, () => {
      request({
        path: collectionPath,
        method: 'GET'
      }).then(({ collection, included }) => {
        this.setState({
          loading: false,
          items: collection,
          included: included
        });
      }).catch(error => {
        Alert.alert('错误', '获取数据失败');
        this.setState({ loading: false });
      });
    });
  }

  render() {
    const { columns } = this.props;
    const { items, loading, included } = this.state;
    if (loading) {
      return  <Loading />;
    }
    return (
      <Table
        list={items}
        columns={columns}
        included={included}
      />
    );
  }
}

const styles = StyleSheet.create({
  table: {
    margin: 15
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

export default TableContainer;
