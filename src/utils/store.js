import * as jwtDecode from 'jwt-decode';
import { get } from 'lodash';
import AsyncStorage from '@react-native-community/async-storage';

class Store {

  setItem = async (name, value) => {
    const str = JSON.stringify(value || '');
    await AsyncStorage.setItem(name, str);
  }

  getItem = async (name) => {
    const str = await AsyncStorage.getItem(name);
    return JSON.parse(str);
  }

  isValid = async () => {
    const authToken = await this.getAuthToken();
    return !!authToken;
  }

  clearSession = async () => {
    await AsyncStorage.clear();
  }

  setAuthToken = async (authToken) => {
    // const payload = jwtDecode(authToken);
    // await AsyncStorage.setItem('userId', get(payload, 'user_id'));
    await AsyncStorage.setItem('authToken', authToken);
  }

  setSession = async (authToken, userId) => {
    // const payload = jwtDecode(authToken);
    await AsyncStorage.setItem('userId', userId);
    await AsyncStorage.setItem('authToken', authToken);
  }

  getAuthToken = async () => {
    return await AsyncStorage.getItem('authToken');
  }

  getUserId = async () => {
    return await AsyncStorage.getItem('userId');
  }
}

export default new Store();

