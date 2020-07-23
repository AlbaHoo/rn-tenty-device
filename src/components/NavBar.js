import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { Actions } from 'react-native-router-flux';
import images from '_src/assets/images';
import store from '_src/utils/store';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flexDirection: 'row',
    borderBottomColor: '#000',
    borderBottomWidth: 1,
  },
  navBarItem: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 10
  },
  navBarIcon:{
    width: 40,
    height: 38,
  }
});

export default class NavBar extends React.Component {
  mounted = false;
  state = {
    login: false
  };

  componentDidMount = async () => {
    this.mounted = true;
    const login = await store.isValid();
    this.setState({login});
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  _renderLeft() {
    return (
      <View style={styles.navBarItem}>
        <Image source={images.icon} style={styles.navBarIcon}/>
      </View>
    );
  }

  _renderMiddle() {
    return (
      <View style={styles.navBarItem}>
        <Text style={{fontSize: 25}}>{this.props.title}</Text>
      </View>
    );
  }

  _renderRight() {
    return (
      <View
        style={[
          styles.navBarItem,
          {flexDirection: 'row', justifyContent: 'flex-end'},
        ]}>
        <TouchableOpacity
          onPress={() => this.state.login ? Actions.setting() : Actions.checkUpdate() }
          style={{paddingRight: 10}}>
          <Image
            style={{width: 30, height: 50}}
            resizeMode="contain"
            source={images.setting}
          />
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this._renderLeft()}
        {this._renderMiddle()}
        {this._renderRight()}
      </View>
    );
  }
}
