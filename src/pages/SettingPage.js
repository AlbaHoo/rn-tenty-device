import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Text,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser, faRedo, faTasks, faPlusCircle, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import Loading from '_src/components/Loading';
import store from '_src/utils/store';

function Item({ id, icon, title, onSelect }) {
  return (
    <TouchableOpacity
      onPress={() => onSelect(id)}
      style={styles.item}
    >
      <FontAwesomeIcon icon={ icon } style={styles.itemIcon} />
      <Text style={styles.itemText}>{title}</Text>
    </TouchableOpacity>
  );
}

class SettingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMenuId: 'details'
    }
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(menuId) {
    this.setState({
      selectedMenuId: menuId || 'details'
    }, () => {
      switch(menuId) {
        case 'details':
          Actions.userDetails();
          break;
        case 'update':
          Actions.checkUpdate();
          break;
        case 'newTask':
          Actions.newTask();
          break;
        case 'tasks':
          Actions.tasks();
          break;
        case 'signout':
          store.clearSession().then(() => {
            Actions.reset('login');
          });
      }
    });
  }

  render() {
    const { selectedMenuId } = this.state;
    const DATA = [
      {
        id: 'details',
        title: '基本信息',
        icon: faUser
      },
      {
        id: 'tasks',
        title: '任务列表',
        icon: faTasks
      },
      {
        id: 'newTask',
        title: '添加维保任务',
        icon: faPlusCircle
      },
      {
        id: 'update',
        title: '版本更新',
        icon: faRedo
      },
      {
        id: 'signout',
        title: '注销登陆',
        icon: faSignOutAlt

      }
    ];
    return (
      <View style={styles.container}>
        {selectedMenuId === 'signout' ? <Loading /> : <></>}
        <View style={styles.detailsContainer}>
          <FlatList
            data={DATA}
            renderItem={({ item }) => (
              <Item
                id={item.id}
                title={item.title}
                icon={item.icon}
                onSelect={this.handleSelect}
              />
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

export default SettingPage;
