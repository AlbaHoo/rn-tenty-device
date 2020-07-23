import React from 'react';
import { Button, InputItem, Checkbox, List, TextareaItem } from '@ant-design/react-native';
import { has } from 'lodash';
import { View, Text,Alert, StyleSheet } from 'react-native';
import { Picker } from '@react-native-community/picker';
import { Theme } from '_src/constants';

export default function FormItemGroup({field, currentAttributes, unsavedAttributes, onChange, onCustomChange, editable}) {
  const { label, name, readonly, type, widget, width, extra, initialValue } = field;
  const value = has(unsavedAttributes, name) ? unsavedAttributes[name] : currentAttributes[name] || initialValue;
  if (typeof widget === 'function') {
    return (
      <View key={name} style={[styles.inputItemContainer, styles.specialRoot]}>
        <View style={styles.specialLabel}>
          <Text style={styles.label}>{label}</Text>
        </View>
        <View style={styles.specialWidget}>
          {widget({
            attributes: currentAttributes,
            unsavedAttributes: unsavedAttributes,
            editable,
            onChange: onChange,
            onCustomChange: onCustomChange,
            readonly,
            value: String(value || '')
          })}
        </View>
      </View>
    );
  }
  if (widget === 'input') {
    return (
      <View key={name} style={[styles.inputItemContainer, { width }]}>
        <InputItem
          labelNumber={7}
          type={type || 'text'}
          style={editable ? styles.editModeInput : styles.readModeInput}
          clear
          value={String(value || '')}
          extra={extra}
          onChange={onChange}
          placeholder={label}
          editable={editable}
        >
          <Text style={styles.label}>{label}</Text>
        </InputItem>
      </View>
    );
  } else if (widget === 'textarea') {
    return (
      <View key={name} style={[styles.inputItemContainer, styles.textareaContainer]}>
        <TextareaItem
          style={styles.textarea}
          rows={5}
          title={label}
          placeholder={label}
          value={String(value || '')}
          onChange={onChange}
          editable={editable}
        />
      </View>
    );
  } else if (widget === 'checkbox') {
    return (
      <View key={name} style={[styles.inputItemContainer, styles.checkboxContainer]}>
        <Checkbox
          checked={value}
          style={styles.checkbox}
          onChange={obj => onChange && onChange(obj.target.checked)}
        >
          <Text style={{fontSize: 16}}>{label}</Text>
        </Checkbox>
      </View>
    );
  } else if (widget === 'select') {
    const options = field.options || [];
    return (
      <View key={name} style={[styles.inputItemContainer, styles.specialRoot]}>
        <View style={styles.specialLabel}>
          <Text style={styles.label}>{label}</Text>
        </View>
        <View style={styles.specialWidget}>
          <Picker
            mode="dropdown"
            enabled={editable}
            style={{height: 50}}
            selectedValue={String(value || '')}
            onValueChange={(itemValue, itemIndex) => {
              onChange && onChange(itemValue);
            }}
          >
            {options.map(item => <Picker.Item key={item.value} label={item.label} value={item.value} />)}
          </Picker>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  specialRoot: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    borderTopWidth: 0,
    borderBottomWidth: 1,
    borderColor: Theme.light
  },
  specialLabel: {
    justifyContent:'center',
    alignItems: 'flex-start',
    paddingLeft: 15,
    width: 130
  },
  specialWidget: {
    flexGrow: 1,
    justifyContent:'center',
    height: 40,
  },
  inputItemContainer: {
    marginTop: 5,
    marginBottom: 5
  },
  label: {
    fontSize: 16
  },
  editModeInput: {
    paddingLeft: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Theme.medium
  },
  textareaContainer: {
    paddingLeft: 5
  },
  checkboxContainer: {
    paddingLeft: 5,
    marginRight: 0,
    borderTopWidth: 0,
    borderBottomWidth: 1,
    borderColor: Theme.light
  },
  checkbox: {
    color: Theme.pGreen,
    margin: 10
  }
});
