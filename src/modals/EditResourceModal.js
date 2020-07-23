import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View
} from "react-native";
import Modal from 'react-native-modal';
import AttributeFormContainer from '_src/containers/AttributeFormContainer';

class EditResourceModal extends React.Component {
  render() {
    const {
      isOpen,
      onClose,
      onAfterSubmit,
      uiSchema,
      resources,
      resource,
      id,
      title,
      extraAttributes,
      submitLabel,
    } = this.props;
    const getPath = `/api/v1/${resources}/${id}`;
    return (
      <Modal
        animationIn="fadeIn"
        animationOut="fadeOut"
        isVisible={isOpen}
        style={styles.modalContainer}
      >
        <View style={[styles.centeredView]}>
          <View style={[styles.modalView]}>
            <AttributeFormContainer
              title={title}
              submitLabel={submitLabel}
              resource={resource}
              editMode={true}
              getPath={getPath}
              uiSchema={uiSchema}
              onClose={onClose}
              onAfterSubmit={onAfterSubmit}
              extraAttributes={extraAttributes}
            />
          </View>
        </View>
      </Modal>
    );
  }
};

const styles = StyleSheet.create({
  modalContainer: {
    margin: 0,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    flex: 1,
    width: 700,
    minHeight: 300,
    maxHeight: '90%',
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
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
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

export default EditResourceModal;
