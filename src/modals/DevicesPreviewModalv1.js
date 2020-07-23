// v1, react-native model
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableHighlight
} from "react-native";
import {
  MenuProvider,
} from 'react-native-popup-menu';
import DevicesLayoutContainer from '_src/containers/OldDevicesLayoutContainer';


export default class DevicesPreviewModal extends React.Component {
  render() {
    const { isOpen, onClose } = this.props;
    return (
      <Modal
        animationType="slide"
        visible={isOpen}

        onBackdropPress={onClose}
      >
          <View style={[styles.centeredView]}>
            <View style={{ flex: 1, maxHeight: 40}}>
              <Text style={styles.text}>看现场-预安装布局</Text>
            </View>
            <View style={[styles.modal]}>
              <DevicesLayoutContainer />
            </View>
            <TouchableHighlight
              onPress={onClose}
            >
              <Text style={styles.textStyle}>Hide Modal</Text>
            </TouchableHighlight>
          </View>
      </Modal>
    );
  }
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: 5
  },
  modal: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
  },
  text: {
    fontSize: 20,
    margin: 10,
    color: 'black',
    fontWeight: "bold",
    textAlign: "center"
  }
});
