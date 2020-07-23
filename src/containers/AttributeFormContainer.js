import React from 'react';
import { Button, InputItem, Checkbox, List, TextareaItem } from '@ant-design/react-native';
import { has } from 'lodash';
import { View, Text, Alert, ScrollView, StyleSheet } from 'react-native';
import { Theme } from '_src/constants';
import FormInputGroup from '_src/components/FormInputGroup';

import Loading from '_src/components/Loading';
import request from '_src/utils/request';
import formatErrors from '_src/utils/formatErrors';

import Logger from '_src/logger';
const logger = new Logger('AttributeFormContainer');

// props: {
// submitLabel
// resource
// getPath
// mutatePath
// onClose
// onAfterSubmit,
// extraAttributes
// }
class AttributeFormContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      isEditing: this.props.editMode || false,
      currentAttributes: {},
      unsavedAttributes: {}
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    const { getPath } = this.props;
    if (getPath) {
      request({
        path: getPath,
        method: 'GET'
      }).then(({ attributes }) => {
        this.setState({
          loading: false,
          currentAttributes: attributes
        });
      }).catch(error => {
        logger.error(error);
        Alert.alert('错误', '获取数据失败');
        this.setState({ loading: false });
      });
    } else {
      this.setState({ loading: false });
    }
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

  handleCancel = () => {
    const { onClose } = this.props;
    this.setState({
      isEditing: false,
      unsavedAttributes: {}
    }, () => onClose && onClose());
  }

  renderActions() {
    const { submitLabel } = this.props;
    const { isEditing } = this.state;
    if (isEditing) {
      return (
        <>
          {this.renderGreenButton(submitLabel || '保存', this.handleSubmit)}
          {this.renderGreenButton('取消', this.handleCancel)}
        </>
      );
    } else {
      return this.renderGreenButton('编辑', () => this.setState({isEditing: true}));
    }
  }

  renderAttrs() {
    const { uiSchema } = this.props;

    return uiSchema.map((field, i) => this.renderItem(field, i));
  }

  async handleSubmit() {
    const { extraAttributes, resource, getPath, mutatePath, mutateMethod, onAfterSubmit } = this.props;
    const body = {
      data: {
        attributes: {
          ...this.state.unsavedAttributes,
          ...(extraAttributes || {})
        },
        type: resource
      }
    };

    this.setState({ loading: true }, () => {
      request({
        path: mutatePath || getPath,
        method: mutateMethod || 'PATCH',
        body: JSON.stringify(body)
      }).then(({ attributes }) => {
        this.setState({
          isEditing: false,
          loading: false,
          currentAttributes: attributes
        }, () => { onAfterSubmit && onAfterSubmit(this.state.currentAttributes) });
      }).catch(error => {
        logger.error(error);
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
    const { label, name, readonly, type, widget, extra, hide } = field;
    const { isEditing, unsavedAttributes, currentAttributes } = this.state;
    const editMode = !readonly && isEditing;
    const value = has(unsavedAttributes, name) ? unsavedAttributes[name] : currentAttributes[name];
    const disabled = this.props.disabled || false;
    const onChange = value => this.handleValueChange(name, value);
    const onCustomChange = (n, v) => this.handleValueChange(n, v);
    if (typeof hide === 'function' && hide(unsavedAttributes)) {
      return <View key={i}></View>;
    }
    return (
      <FormInputGroup
        key={name}
        field={field}
        currentAttributes={currentAttributes}
        unsavedAttributes={unsavedAttributes}
        disabled={disabled}
        onChange={onChange}
        onCustomChange={onCustomChange}
        editable={editMode}
      />
    );
  }

  render() {
    const { loading } = this.state;
    if (loading) {
      return (
        <View style={styles.container}><Loading /></View>
      );
    }
    return (
      <View style={styles.container}>
        <ScrollView
          persistentScrollbar={true}
          automaticallyAdjustContentInsets={false}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{paddingVertical:20}}
        >
          <List renderHeader={this.props.title || '基本信息'}>
            {this.renderAttrs()}
          </List>
        </ScrollView>
        <View style={styles.buttonContainer}>
          {this.renderActions()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    alignItems: 'flex-end',
    padding: 10,
    display: 'flex',
    flexDirection: 'row'
  },
  button: {
    backgroundColor: Theme.pGreen,
    margin: 5,
    width: 100
  }
});
export default AttributeFormContainer;
