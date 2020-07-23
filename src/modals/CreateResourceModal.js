import React from 'react';
import {
  Alert,
  StyleSheet,
  ScrollView,
  View,
  Text
} from "react-native";
import { has, merge } from 'lodash';
import { Button, InputItem, Checkbox, List, TextareaItem } from '@ant-design/react-native';
import { Theme } from '_src/constants';
import Modal from 'react-native-modal';
import FormInputGroup from '_src/components/FormInputGroup';
import Loading from '_src/components/Loading';
import request from '_src/utils/request';
import formatErrors from '_src/utils/formatErrors';

// props
//initialAttributes
//isOpen,
//onClose,
//uiSchema,
//resources,
//resource,
//title,
//mutatePath
class CreateResourceModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      created: false,
      currentAttributes: {},
      unsavedAttributes: {}
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit() {
    const { initialAttributes, resource, mutatePath, onClose } = this.props;
    const attrs = merge(
      initialAttributes,
      this.state.unsavedAttributes
    );
    const body = {
      data: {
        attributes: {
          ...attrs
        },
        type: resource
      }
    };

    this.setState({ loading: true }, () => {
      request({
        path: mutatePath,
        method: 'POST',
        body: JSON.stringify(body),
      }).then(({ attributes }) => {
        this.setState({
          loading: false,
          created: true,
          currentAttributes: attributes
        }, () => { onClose });
      }).catch(error => {
        console.log(error);
        const errors = error?.response?.errors;
        const message =  errors ? formatErrors(errors) : JSON.stringify(error);
        Alert.alert('错误', message);
        this.setState({ loading: false });
      });
    });
  }

  handleValueChange = (name, value) => {
    const unsavedAttributes = {
      ...this.state.unsavedAttributes,
      [name]: value
    }
    this.setState({
      unsavedAttributes
    });
  }

  renderItem(field, i) {
    const { label, name, type, widget, extra, hide } = field;
    const { created, unsavedAttributes, currentAttributes } = this.state;
    const value = has(unsavedAttributes, name) ? unsavedAttributes[name] : currentAttributes[name];
    const onChange = value => this.handleValueChange(name, value);
    if (typeof hide === 'function' && hide(unsavedAttributes)) {
      return <View key={i}></View>;
    }
    return (
      <FormInputGroup
        key={i}
        field={field}
        currentAttributes={currentAttributes}
        unsavedAttributes={unsavedAttributes}
        onChange={onChange}
        editable={!created}
      />
    );
  }

  renderAttrs() {
    const { uiSchema } = this.props;
    if (!uiSchema) {
      return <></>;
    }
    return (
      <>
        {uiSchema.map((field, i) => this.renderItem(field, i))}
      </>
    );
  }

  renderActions() {
    const { onClose } = this.props;
    const { currentAttributes, created } = this.state;
    return (
      <View style={styles.buttonContainer}>
        <Button
          disabled={created}
          type="default"
          style={created ? styles.greyButton : styles.button}
          onPress={this.handleSubmit}
        >
          <Text style={{color: '#fff'}}>{created ? '已添加' : '添加' }</Text>
        </Button>
        <Button
          type="default"
          style={styles.button}
          onPress={onClose}
        >
          <Text style={{color: '#fff'}}>关闭</Text>
        </Button>
      </View>
    );
  }

  renderModalView() {
    const { title } = this.props;
    const { loading } = this.state;
    if (loading) {
      return <Loading />;
    }
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <List renderHeader={title || '创建'}>
            {this.renderAttrs()}
          </List>
        </ScrollView>
        <View>{this.renderActions()}</View>
      </View>
    );
  }

  render() {
    const {
      isOpen,
      onClose,
      uiSchema,
      resources,
      resource,
      title
    } = this.props;
    const mutatePath = `/api/v1/${resources}`;
    return (
      <Modal
        animationIn="fadeIn"
        animationOut="fadeOut"
        isVisible={isOpen}
      >
        <View style={[styles.centeredView]}>
          <View style={[styles.modalView]}>
            {this.renderModalView()}
          </View>
        </View>
      </Modal>
    );
  }
};

const styles = StyleSheet.create({
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    width: 700,
    minHeight: 400,
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
  },
  container: {
    width: '100%',
    height: '100%',
  },
  scrollView: {
    height: '90%',
  },
  buttonContainer: {
    alignItems: 'flex-end',
    paddingBottom: 10,
    display: 'flex',
    flexDirection: 'row'
  },
  button: {
    backgroundColor: Theme.pGreen,
    margin: 5,
    width: 100
  },
  greyButton: {
    backgroundColor: Theme.dark,
    margin: 5,
    width: 100
  }
});

export default CreateResourceModal;
