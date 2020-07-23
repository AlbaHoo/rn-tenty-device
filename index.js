/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from '_src/app';
import {name as appName} from './app.json';
import {decode, encode} from 'base-64'
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: componentWillReceiveProps has been renamed']);

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

AppRegistry.registerComponent(appName, () => App);
