// react-native community modal
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} from "react-native";
import {
  MenuProvider,
} from 'react-native-popup-menu';
import Modal from 'react-native-modal';
import DevicesLayoutContainer from '_src/containers/DevicesLayoutContainer';
import { Theme } from '_src/constants';


export default class DevicesPreviewModal extends React.Component {
  state = {
    show: false,
  }
  render() {
    const { isOpen, onClose } = this.props;
    return (
      <Modal
        hideModalContentWhileAnimating={true}
        animationIn="fadeIn"
        animationOut="fadeOut"
        isVisible={isOpen}
        style={styles.modalContainer}
        onBackdropPress={onClose}
        onModalShow={() => this.setState({show: true})}
      >
        <MenuProvider style={styles.menuProvider} skipInstanceCheck style={{ paddingTop: -50, backgroundColor: 'green'}}>
          <View style={[styles.centeredView]}>
            <View style={{ flex: 1, maxHeight: 40}}>
              <Text style={styles.text}>看现场-预安装布局</Text>
            </View>

            <View style={[styles.modal]}>
              <DevicesLayoutContainer
                loadingStyle="inline"
                category="preInstall"
                disabled={false}
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableHighlight
                style={styles.button}
                onPress={onClose}
              >
                <Text style={{color: 'white'}}>关闭</Text>
              </TouchableHighlight>
            </View>
          </View>
        </MenuProvider>
      </Modal>
    );
  }
};

const styles = StyleSheet.create({
  modalContainer: {
    margin: 0,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'flex-end',
  },
  button: {
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.pGreen,
    borderRadius: 10,
    margin: 10,
    padding: 10,
    elevation: 2
  },
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
  },
  menuProvider: {
    justifyContent: 'flex-start',
  },
});
