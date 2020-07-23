import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableHighlight
} from "react-native";
import { Button } from '@ant-design/react-native';
import SignatureCapture from 'react-native-signature-capture';
import Modal from 'react-native-modal';
import { Theme } from '_src/constants';
import Logger from '_src/logger';
const logger = new Logger('SignatureModal');

class SignatureModal extends React.Component {
  state = {
    isEmpty: true
  }

  saveSign() {
    this.refs["sign"].saveImage();
  }

  resetSign = () => {
    this.setState({isEmpty: true}, () => {
      this.refs["sign"].resetImage();
    });
  }

  _onSaveEvent = result => {
    //result.encoded - for the base64 encoded png
    //result.pathName - for the file path name
    const { onSave } = this.props;
    const base64 = result.encoded;
    logger.info(`Save new signature: ${base64.toString().substring(0, 15)}`);
    onSave(`data:image/png;base64,${base64}`);
  }

  _onDragEvent = () => {
     // This callback will be called when the user enters signature
    this.setState({isEmpty: false});
    logger.info("dragged");
  }

  render() {
    const { isOpen, onClose } = this.props;
    const { isEmpty } = this.state;
    return (
      <View behavior={'padding'}>
        <Modal
          animationIn="slideInUp"
          animationOut="slideOutDown"
          animationInTiming={800}
          animationOutTiming={800}
          useNativeDriver={true}
          hideModalContentWhileAnimating={true}
          isVisible={isOpen}
          onBackdropPress={onClose}
          style={styles.modalContainer}
        >
          <View style={{ flex: 1 }}>
            <SignatureCapture
              style={[{flex:1},styles.signature]}
              ref="sign"
              onSaveEvent={this._onSaveEvent}
              onDragEvent={this._onDragEvent}
              saveImageFileInExtStorage={false}
              showNativeButtons={false}
              showTitleLabel={false}
              viewMode={"landscape"}/>

            <View style={{ flexDirection: "row" }}>
              <TouchableHighlight
                disabled={isEmpty}
                style={styles.buttonStyle}
                onPress={() => { this.saveSign() } }
              >
                <Text style={isEmpty ? styles.disabled : styles.buttonText}>保存</Text>
              </TouchableHighlight>

              <TouchableHighlight style={styles.buttonStyle}
                onPress={() => { this.resetSign() } } >
                <Text style={styles.buttonText}>重置</Text>
              </TouchableHighlight>

              <TouchableHighlight style={styles.buttonStyle}
                onPress={onClose}
               >
                <Text style={styles.buttonText}>取消</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
  renderGreenButton(text, onPress) {
    return (
      <Button
        type="default"
        style={styles.button}
        onPress={onPress}
      >
        <Text style={{color: '#fff'}}>{text}</Text>
      </Button>
    );
  }

};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    margin: 50 // This is the important style you need to set
  },
  actionsContainer: {
    zIndex: 100,
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 300,
    height: 100
  },
  actions: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'row'
  },
  buttonContainer: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: Theme.pGreen,
    margin: 5,
    width: 100
  },
  buttonStyle: {
    flex: 1,
    justifyContent: "center", alignItems: "center", height: 50,
    backgroundColor: "#eeeeee",
    margin: 10
  },
  buttonText: {
    fontSize: 20
  },
  disabled: {
    fontSize: 20,
    opacity: 0.5
  }
});

export default SignatureModal;
