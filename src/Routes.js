import React from 'react';
import Text from 'react-native';
import { Router, Scene, Stack } from 'react-native-router-flux';
import CheckUpdatePage from '_src/pages/CheckUpdatePage';
import HomePage from '_src/pages/HomePage';
import LoginPage from '_src/pages/LoginPage';
import NewTaskPage from '_src/pages/NewTaskPage';
import FieldTasksPage from '_src/pages/FieldTasksPage';
import UserDetailsPage from '_src/pages/UserDetailsPage';
import ScanPage from '_src/pages/ScanPage';
import FieldTaskDetailsPage from '_src/pages/FieldTaskDetailsPage';
import SettingPage from '_src/pages/SettingPage';
import ListPage from '_src/pages/ListPage';
import { Actions } from 'react-native-router-flux';
import store from '_src/utils/store';
import NavBar from '_src/components/NavBar';

const Routes = () => (
  <Router>
    <Scene key="root">
      <Scene key="checkUpdate"
        component={CheckUpdatePage}
        title="检查更新"
      />
      <Scene key="home"
        component={HomePage}
        initial={true}
      />
    </Scene>
  </Router>
)
export default Routes;
