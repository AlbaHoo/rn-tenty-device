import React, { Component } from 'react';

import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking
} from 'react-native';

import { RNCamera } from 'react-native-camera';
import { Actions } from 'react-native-router-flux';
import QRCodeScanner from 'react-native-qrcode-scanner';
import generateNonce from '_src/utils/generateNonce';
import request from '_src/utils/request';
import formatErrors from '_src/utils/formatErrors';

import Logger from '_src/logger';
const logger = new Logger('ScanPage');

class ScanPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nonce: ''
    }
  }

  handleSuccess = e => {
    const { fieldTaskId } = this.props;
    const deviceId = e.data;
    logger.info(e.data);
    if (!fieldTaskId || !deviceId) {
      return;
    }

    const path = `/api/v1/rpc/scan_device?field_task_id=${fieldTaskId}&&device_id=${deviceId}`;

    const actions = [
      {
        text: '返回主页',
        onPress: () => Actions.pop(),
        style: "cancel"
      },
      {
        text: '继续盘点',
        onPress: () => this.setState({nonce: generateNonce(this.state.nonce)})
      }
    ];
    logger.info(path);
    request({
      path,
      method: 'GET'
    }).then(({ data }) => {
      Alert.alert(
        '盘点设备成功',
        data?.message || '成功',
        actions,
        { cancelable: false }
      );
    }).catch(error => {
      const errors = error?.response?.errors;
      const message =  errors ? formatErrors(errors) : JSON.stringify(error);
      Alert.alert('盘点设备失败', message, actions)
    });
  };

  render() {
    return (
      <QRCodeScanner
        key={this.state.nonce}
        reactivate={false}
        onRead={this.handleSuccess}
        flashMode={RNCamera.Constants.FlashMode.auto}
        topContent={
          <Text style={styles.centerText}>
            <Text style={styles.textBold}>QR_code</Text> on
          </Text>
        }
        bottomContent={
          <TouchableOpacity style={styles.buttonTouchable}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777'
  },
  textBold: {
    fontWeight: '500',
    color: '#000'
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)'
  },
  buttonTouchable: {
    padding: 16
  }
});

export default ScanPage;
