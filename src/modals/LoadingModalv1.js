import React from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  View
} from "react-native";
import Loading from '_src/components/Loading';

class LoadingModal extends React.Component {
  constructor(props) {
    super(props);
    this.mounted = false;
    this.state = {
      visible: true
    }
  }

  componentDidMount() {
    this.mounted = true;
    this.fadeTimeout();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.isOpen && !prevProps.isOpen) {
      this.setState({ visible: true }, fadeTimeout);
    }
  }

  fadeTimeout = () => {
    const { debounce } = this.props;
    setTimeout(() => {
      if (this.mounted) {
        this.setState({visible: false});
      }
    }, debounce || 0);
  }

  render() {
    const { isOpen, text } = this.props;
    return (
      <View behavior={'padding'}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.visible || this.props.isOpen}
        >
          <View style={[styles.modalContainer, styles.centeredView]}>
            <View style={[styles.modal, styles.modalView]}>
              <Loading />
              {text && <Text style={styles.text}>{text}</Text>}
            </View>
          </View>
        </Modal>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  modal: {
    width: 300,
    height: 200
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
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
  text: {
    margin: 20,
    fontSize: 20,
    color: 'black',
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

export default LoadingModal;
