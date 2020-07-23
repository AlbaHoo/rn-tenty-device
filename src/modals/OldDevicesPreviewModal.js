import React from 'react';
import {
  StyleSheet,
  Text,
  View
} from "react-native";
import Modal from 'react-native-modal';
import OldDevicesLayoutContainer from '_src/containers/OldDevicesLayoutContainer';

class OldDevicesPreviewModal extends React.Component {
  render() {
    const { isOpen, onClose } = this.props;
    return (
      <Modal
        animationIn="fadeIn"
        animationOut="fadeOut"
        isVisible={isOpen}

        onBackdropPress={onClose}
      >
        <View style={[styles.centeredView]}>
          <View style={{ flex: 1, maxHeight: 40}}>
            <Text style={styles.text}>看现场-原设备布局</Text>
          </View>
          <View style={[styles.modal]}>
            <OldDevicesLayoutContainer disabled={true} />
          </View>
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

export default OldDevicesPreviewModal;
