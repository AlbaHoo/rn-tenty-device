import React from 'react';
import { View, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Button } from '@ant-design/react-native';
import { Theme } from '_src/constants';

class TaskHeader extends React.Component {
  render() {
    const { category, organisation } = this.props;
    return (
      <View style={styles.container}>
        <Text style={[styles.category]}>{category}</Text>
        <Text style={[styles.name]}>{organisation?.name}</Text>
      </View>
    );
  }
}
const styles = {
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row'
  },
  category: {
    position: 'absolute',
    left: 0,
    fontSize: 18
  },
  name: {
    fontSize: 18,
    flex: 1,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent:'center',
  },
  button: {
    backgroundColor: Theme.pGreen,
    flex: 1
  },
};

export default TaskHeader;
