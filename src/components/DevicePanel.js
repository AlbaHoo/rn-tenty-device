import React from 'react';
import { Image, View, Text, TouchableHighlight } from 'react-native';
import { Theme } from '_src/constants';
import DeviceSvg from '_src/assets/svg.js';
import images from '_src/assets/images';
import deviceInfo from '_src/utils/deviceInfo';

class DevicePanel extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{alignItems: "center" }}>
        {this.renderDevices()}
      </View>
    );
  }

  renderDevices = () => {
    // list of icons: name
    const devices = deviceInfo.getDeviceIcons();
    return (
      <View style={[styles.rowFlex, {paddingLeft: 10}]}>
        {devices.map(this.renderSingleDevice)}
      </View>
    );

  }

  renderSingleDevice = (item, i) => {
    const { unassigned, onClickToAdd, disabled } = this.props;
    const height = 50;
    const width = height * item.shape;
    const number = unassigned ? unassigned[item.name] || 0 : 100;
    const color = (disabled || number <= 0) ? Theme.dark : Theme.pGreen;
    return (
      <TouchableHighlight
        key={i}
        style={[{marginRight: 10, flex: item.shape}]}
        activeOpacity={0.6}
        underlayColor="#DDDDDD"
        disabled={disabled}
        onPress={() => onClickToAdd && onClickToAdd(item.name)}>
        <View key={item.name} style={[styles.deviceContainer]}>
          <DeviceSvg name={item.name} color={color} width={width} height={height} />
          <Text>{item.label}</Text>
          {!disabled && <Text>{number < 100 ? `余: ${number}` : '充足'}</Text>}
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = {
  rowFlex: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'row'
  },
  deviceContainer: {
    minHeight: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  }
};

export default DevicePanel;
