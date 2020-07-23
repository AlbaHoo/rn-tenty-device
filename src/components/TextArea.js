import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import EditResourceModal from '_src/modals/EditResourceModal';
import { Theme } from '_src/constants';

export default class TextAreaButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    }
  }

  generateUiSchema = (name, label) => {
    return [
      {
        label,
        name,
        type: 'number',
        widget: 'textarea'
      }
    ];
  }

  handleAfterSubmit = (attributes) => {
    const { onChange, name } = this.props;
    onChange && onChange(attributes[name]);
    this.setState({ isOpen: false });
  }

  render() {
    const { isOpen } = this.state;
    const { id, prop, name, text, disabled } = this.props;

    return (
      <TouchableOpacity
        disabled={disabled}
        style={styles.button}
        onPress={() => this.setState({ isOpen: true })}
      >
        <Text>{prop}: </Text>
        <Text>{text}</Text>
        <EditResourceModal
          isOpen={isOpen}
          resources="field_tasks"
          resource="field_task"
          id={id}
          title={prop}
          onClose={()=> this.setState({isOpen: false})}
          onAfterSubmit={this.handleAfterSubmit}
          uiSchema={this.generateUiSchema(name, prop)}
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10
  },
  button: {
    alignItems: 'flex-start',
    height: '100%',
    backgroundColor: Theme.light,
    padding: 10
  },
  countContainer: {
    alignItems: "center",
    padding: 10
  }
});

