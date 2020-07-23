import * as React from 'react';
import { View, Text, Alert, StyleSheet } from "react-native";
import { Picker } from '@react-native-community/picker';
import request from '_src/utils/request';

export default class ResourceSelector extends React.Component {
  constructor(props) {
    super(props);
    this.mounted = false;
    this.state = {
      items: [],
      loading: true,
      selectedValue: this.props.selectedValue || null
    }
  }

  componentDidMount() {
    this.mounted = true;
    const { remotePath } = this.props;
    if (remotePath) {
      request({
        path: `/api/v1/${remotePath}`,
        method: 'GET'
      }).then(({ data }) => {
        this.setState({
          loading: false,
          items: data?.data || []
        });
      }).catch(error => {
        console.log(error);
        Alert.alert('错误', '服务器错误');
        this.setState({ loading: false });
      });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleSelect = (itemValue, itemIndex) => {
    const { onChange } = this.props;
    if (this.mounted) {
      this.setState({ selectedValue: itemValue },
        () => onChange && onChange(itemValue)
      );
    }
  }

  render() {
    const { items, selectedValue } = this.state;
    const { editable, placeholder, labelKey } = this.props;
    return (
      <Picker
        enabled={editable}
        mode="dropdown"
        style={[styles.picker, editable ? styles.enabled : styles.disabled]}
        selectedValue={selectedValue}
        onValueChange={this.handleSelect}
      >
        <Picker.Item label={this.props.placeholder || '请选择'} value='' />
        {items.map(item => <Picker.Item key={item.id} label={item.attributes[labelKey || 'name']} value={item.id} />)}
      </Picker>
    );
  }
}
const styles = StyleSheet.create({
  picker: {
    height: 50,
  },
  disabled: {
    opacity: 0.5
  }
});

