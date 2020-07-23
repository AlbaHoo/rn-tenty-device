import React from 'react'
import {
  Alert,
  NativeModules,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  View
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { FloatingAction } from "react-native-floating-action";
import { Theme } from '_src/constants';
import { TaskContext } from '_src/context/TaskProvider';
import Loading from '_src/components/Loading';
import Sync from '_src/features/sync';
import TentyVideo from '_src/views/TentyVideo';
import store from '_src/utils/store';
import generateNonce from '_src/utils/generateNonce';
import request from '_src/utils/request';
import Logger from '_src/logger';
const logger = new Logger('Home');

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.mounted = false;
    this.state = {
      loading: true,
      data: {}
    }
  }

  //getDeviceId() {
  //  NativeModules.MPush.getDeviceId(function(args) {
  //    that.setState({
  //      data: args
  //    });
  //  });
  //}

  handshake = async () => {
    const sync = Sync.getInstance();
    sync.handshake()
      .then(sync.sync)
      .then(data => {
        this.setState({data})
      })
      .then(() => sync.startHeartbeat())
      .catch (error => {
        logger.error(error);
        if (this.mounted) {
          this.setState({ loading: false });
        }
      });
  }

  componentDidMount() {
    this.mounted = true;
    this.handshake();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { data } = this.state;
    return (
      <ScrollView>
        <View style={{backgroundColor: 'red'}}>
          <TentyVideo />
          <Text>{JSON.stringify(data, null, 2)}</Text>
        </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  pageContainer: {
    padding: 10,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  titleContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    width: '100%'
  },
  layoutContainer: {
    width: '100%',
    flex: 17,
    display: 'flex',
    flexDirection: 'row',
  }
});
export default HomePage
