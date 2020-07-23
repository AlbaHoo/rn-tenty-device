import React, { Component } from 'react';
import {
  NativeModules,
  Text,
  View,
  Alert,
  StyleSheet
} from 'react-native';
import { Button, InputItem } from '@ant-design/react-native';
import { Actions } from 'react-native-router-flux';
import { API_ORIGIN, Theme } from '_src/constants';
import store from '_src/utils/store';
import formatErrors from '_src/utils/formatErrors';

import Logger from '_src/logger';
const logger = new Logger('LoginPage');

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loging: false,
      email: '',
      password: ''
    }
  }

  handleLogin = () => {
    const { email, password } = this.state;
    // const digest = btoa(`email/${email}:${password}`);
    const checkStatus = async (response) => {
      logger.info(response);
      if (response.status >= 200 && response.status < 300) {
        return response;
      } else {
        const error = new Error(response.statusText);
        error.response = await response.json();
        throw error;
      }
    }

    const parseJSON = (response) => response.json();

    // 'Authorization': `Basic ${digest}`,
    this.setState({ loading: true }, () => {
      fetch(`${API_ORIGIN}/api/v1/tokens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: {
            attributes: {
              email: email,
              password: password
            }
          }
        })
      }).then(checkStatus).then(parseJSON).then(data => {
        const authToken = data.data.attributes.auth_token;
        const userId = data.data.attributes.user_id;
        NativeModules.MPush.bindAccount(userId, function(message) {
          logger.info(message);
        });
        store.setSession(authToken, userId).then(() => {
          Actions.reset('home');
        });
      }).catch(error => {
        const errors = error?.response?.errors;
        const message =  errors ? formatErrors(errors) : '无法连接到服务器, 请联系管理员';
        Alert.alert('错误', message);
        this.setState({ loading: false });
      });
    });
  }

  render() {
    const { email, password, loading } = this.state;
    return (
      <View style={styles.LoginPage}>
        <View style={styles.container}>
          <View style={styles.form}>
            <Text style={styles.landingText}>欢迎登陆</Text>
            <InputItem
              clear
              disabled={loading}
              type="email"
              value={email}
              onChange={value => {
                this.setState({
                  email: value,
                });
              }}
              placeholder="请输入维修队登陆邮箱"
            >
              邮箱
            </InputItem>

            <InputItem
              clear
              disabled={loading}
              type="password"
              value={password}
              onChange={value => {
                this.setState({
                  password: value,
                });
              }}
              placeholder="请输入密码"
            >
              密码
            </InputItem>
            <Button
              style={styles.loginBtn}
              loading={loading}
              onPress={this.handleLogin}
            >
              <Text style={{color: '#fff'}}>登陆</Text>
            </Button>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  LoginPage: {
    backgroundColor: Theme.pGreen,
    height: '100%',
    width: '100%'
  },
  container:{
    height: '100%',
    marginLeft: '20%',
    marginRight: '20%',
    padding: 50,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: '#fff'
  },
  form: {
    width: '100%'
  },
  landingText: {
    paddingBottom: 20,
    fontSize: 30,
    color: Theme.pGreen
  },
  loginBtn: {
    marginTop: 20,
    width: '100%',
    // textAlign: 'center',
    // color: 'red',
    backgroundColor: Theme.pGreen
  }
});

export default LoginPage;
