/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

require('moment/locale/zh-cn.js');
import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { DeviceEventEmitter, Alert } from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
import Routes from '_src/Routes.js'

class App extends Component {
  //绑定事件
  componentDidMount() {
    DeviceEventEmitter.addListener('onMessage', this.onMessage);
    DeviceEventEmitter.addListener('onNotification', this.onNotification);
  }
  //解绑事件
  componentWillUnmount() {
    DeviceEventEmitter.removeListener('onMessage', this.onMessage);
    DeviceEventEmitter.removeListener('onNotification', this.onNotification);
  }
  //事件处理逻辑
  onMessage(e) {
    console.log("Message Received. Title:" + e.title + ", Content:" + e.content);
    Alert.alert(
      e.title,
      e.content,
      [{
        text: '查看详情',
        onPress: () => Actions.reset('home')
      }],
      { cancelable: false }
    );
  }
  onNotification(e) {
    console.log("Notification Received.Title:" + e.title + ", Content:" + e.content);
    Alert.alert(
      e.title,
      e.content,
      [{
        text: '查看详情',
        onPress: () => Actions.reset('home')
      }],
      { cancelable: false }
    );
  }
  render() {
    return (
      <Routes />
    );
  }
}
export default () => (
  <MenuProvider skipInstanceCheck>
    <App />
  </MenuProvider>
);
