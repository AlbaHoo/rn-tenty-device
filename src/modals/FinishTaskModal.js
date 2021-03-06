import React from 'react';
import {
  StyleSheet,
  Text,
  View
} from "react-native";
import Modal from 'react-native-modal';
import FinishTask from '_src/components/FinishTask';

class FinishTaskModal extends React.Component {
  render() {
    const { isOpen, onClose, task, onSuccess } = this.props;
    return (
      <Modal
        animationIn="fadeIn"
        animationOut="fadeOut"
        isVisible={isOpen}
        onBackdropPress={onClose}
      >
        <View style={[styles.modalContainer, styles.centeredView]}>
          <View style={[styles.modal, styles.modalView]}>
            <FinishTask
              task={task}
              onSuccess={onSuccess}
              status="done"
            />
          </View>
        </View>
      </Modal>
    );
  }
};

const styles = StyleSheet.create({
  modal: {
    width: 400,
    height: 300
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  }
});

export default FinishTaskModal;
