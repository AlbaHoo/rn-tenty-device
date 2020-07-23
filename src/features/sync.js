import { NativeModules, Dimensions } from 'react-native';
import * as UpdateAPK from "rn-update-apk";
import store from '_src/utils/store';
import request from '_src/utils/request';

import Logger from '_src/logger';
const logger = new Logger('Sync');

const HEARTBEAT_INTERVAL = 60;

function Sync() {
  this.interval = null;
}

Sync.prototype.handshake = async function () {
  const mac = await NativeModules.Utility.getMacAddress();
  logger.info('handshake with mac: ' + mac);
  const body = {
    mac_address: '12:34:56:78:90:aa'
  };
  const { data } = await request({
    path: '/api/v1/boxes/handshake',
    method: 'POST',
    body: JSON.stringify(body)
  });
  const { id, cloud_password } = data;
  await store.setItem('id', id);
  await store.setItem('password', cloud_password);
  return data;
}

Sync.prototype.sync = async function () {
  logger.info('syncing...');
  const id = await store.getItem('id');
  const password = await store.getItem('password');
  const ip = await NativeModules.Utility.getIpAddress();
  const version = UpdateAPK.getInstalledVersionName();
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  if (id && password) {
    const { data } = await request({
      path: `/api/v1/boxes/${id}/sync`,
      method: 'PATCH',
      body: JSON.stringify({ip, height, width, password, version})
    });
    const { screen_name, enable_siderbar, enable_present_mode, display_option } = data;
    await store.setItem('screenName', screen_name);
    await store.setItem('enableSiderbar', enable_siderbar);
    await store.setItem('enablePresentMode', enable_present_mode);
    await store.setItem('displayOption', display_option);
    return data;
  } else {
    const error = new Error('Sync failed');
    error.message = `id: ${id}, version: ${version}, pw: ${password}`;
    throw error;
  }
}

Sync.prototype.heartbeat = async function () {
  logger.info('heartbeat...');
  const id = await store.getItem('id');
  const password = await store.getItem('password');
  return await request({
    path: `/api/v1/boxes/${id}/heartbeat`,
    method: 'PATCH',
    body: JSON.stringify({password})
  });
}

Sync.prototype.startHeartbeat = function () {
  logger.info('start heartbeat');
  this.stopHeartbeat();
  // send a heartbeat so the cloud knows we're alive
  this.heartbeat();
  this.internal = setInterval(this.heartbeat.bind(this), HEARTBEAT_INTERVAL * 1000);
}

Sync.prototype.stopHeartbeat = function () {
  if (this.interval !== null) {
    clearInterval(this.interval);
    this.interval = null;
  }
}

let instance = null;

module.exports.getInstance = function () {
  if (instance === null) {
    instance = new Sync();
  }
  return instance;
};

module.exports.Sync = Sync;

