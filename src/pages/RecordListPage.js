import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Text,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Loading from '_src/components/Loading';
import store from '_src/utils/store';
import request from '_src/utils/request';

const columns = [
  {
    header: {
      label: '时间',
      attribute: 'id'
    },
    flex: 1,
    render: (resource) => <Text style={styles.cell}>{resource.id}</Text>
  },
  {
    header: {
      label: 'title',
      attribute: 'title'
    },
    flex: 3,
    render: (resource) => <Text style={styles.cell}>{resource.title}</Text>
  }
];

function Row({item}) {
  const {id, title} = item;
  return (
    <View style={[styles.rowContainer, { display: 'flex', flexDirection: 'row'}]}>
      {columns.map(c => <View style={{flex: c.flex}} >{c.render(item)}</View>)}
    </View>
  );
}

class ListPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      items: []
    }
  }

  async componentDidMount() {
    const { deviceId } = this.props;
    if (!deviceId) {
      return;
    }
    this.setState({loading: true}, () => {
      request({
        path: `/api/v1/repair_records?filter[device_id]=${deviceId}`,
        method: 'GET'
      }).then(({ data }) => {
        this.setState({
          loading: false,
          items: data.data
        });
      }).catch(error => {
        Alert.alert('错误', '获取数据失败');
        this.setState({ loading: false });
      });
    });
  }

  render() {
    const { loading, items } = this.state;
    const DATA = [
      {
        id: 'details',
        title: '基本信息',
      },
      {
        id: 'tasks',
        title: '任务列表',
      },
      {
        id: 'signout',
        title: '注销登陆',
      }
    ];
    return (
      <View style={styles.container}>
        {loading ? <Loading /> : <></>}
        <View style={styles.detailsContainer}>
          <FlatList
            data={DATA}
            renderItem={({ item }) => (
              <Row item={item}/>
            )}
            keyExtractor={item => item.id}
          />
        </View>
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
  rowContainer: {
    display: 'flex',
    flexDirection: 'row',
    padding: 10
  },
  cell: {
    fontSize: 16
  },
  detailsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  item: {
    width: '100%',
    padding: 30,
    display: 'flex',
    flexDirection: 'row'
  },
  itemIcon: {
    padding: 13,
    marginLeft: 20,
    marginRight: 30,
    flex: 1
  },
  itemText: {
    flex: 1,
    fontSize: 18,
  }
});

export default ListPage;
