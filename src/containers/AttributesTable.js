import React from 'react';
import { Button, InputItem, Checkbox, List, TextareaItem } from '@ant-design/react-native';
import { View, Text,Alert, StyleSheet } from 'react-native';
import { has, get } from 'lodash';
import { Theme } from '_src/constants';
import request from '_src/utils/request';

// props: {
// resource
// uiScuema
// attributes
// }
class AttributesTable extends React.Component {
  constructor(props) {
    super(props);
  }

  renderAttrs = () => {
    const { uiSchema, attributes } = this.props;
    return uiSchema.map((field) => this.renderItem(field, attributes));
  }

  renderItem = (field, attributes) => {
    const { label, name, required, type, widget } = field;
    const keys = name.split('.');
    const value = get(attributes, keys);
    const error = !value && required;
    if (widget === 'input') {
      return (
        <View key={name}>
          <InputItem
            labelNumber={7}
            type={type || 'text'}
            style={styles.readModeInput}
            clear
            error={error}
            value={String(value || '')}
            placeholder={label}
            editable={false}
          >
            <Text style={{fontSize: 16}}>{label}</Text>
          </InputItem>
        </View>
      );
    } else if (widget === 'textarea') {
      return (
        <View key={name} style={styles.textareaItem}>
          <Text style={{fontSize: 16}}>{label}</Text>
          <TextareaItem
            style={styles.textarea}
            rows={5}
            title={label}
            value={String(value || '')}
            editable={false}
          />
        </View>
      );
    } else if (widget === 'checkbox') {
      return (
        <View key={name} style={{marginTop: 10, marginBottom: 10}}>
          <Checkbox
            checked={value}
            style={styles.checkbox}
            disabled={true}
          >
            <Text style={{fontSize: 16}}>{label}</Text>
          </Checkbox>
        </View>
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <List renderHeader={this.props.title || '基本信息'}>
            {this.renderAttrs()}
          </List>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    paddingBottom: 20
//    height: '100%',
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
  textareaItem: {
    margin: 15,
    display: 'flex',
    flexDirection: 'row',
  },
  checkbox: {
    color: Theme.pGreen,
    margin: 10
  }
});
export default AttributesTable;
