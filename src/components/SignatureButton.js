import React from 'react';
import { TouchableOpacity, Text, View, Image, StyleSheet, Dimensions } from 'react-native';
import { Button } from '@ant-design/react-native';
import { Theme } from '_src/constants';
import SignatureModal from '_src/modals/SignatureModal';
import Logger from '_src/logger';
const logger = new Logger('SignatureButton');

export default class SignatureButton extends React.Component {
  state = {
    isOpen: false
  }

  renderSignature(text, uri) {
    const screenHeight = Dimensions.get('window').height;
    const screenWidth = Dimensions.get('window').width;
    const height = 40;
    const width = height / screenHeight * screenWidth;
    if (uri) {
      return <Image style={{width, height, borderBottomWidth: 1, borderColor: 'black'}} source={{uri: uri}}/>

    } else {
      return <View style={styles.sig}><Text>{text}</Text></View>;
    }
  }

  handleSave = (uri) => {
    logger.info('save signature');
    const { onSave } = this.props;
    this.setState({isOpen: false}, () => {
      onSave && onSave(uri);
    })
  }

  render() {
    const { isOpen } = this.state;
    const { text, label, uri } = this.props;
    console.log(this.props);
    return (
      <TouchableOpacity
        style={styles.sigContainer}
        onPress={() => this.setState({ isOpen: true })}
      >
        <Text>{label}</Text>
        <Text>: </Text>

        {this.renderSignature(text, uri)}
        {isOpen && <SignatureModal
            isOpen={true}
            onSave={this.handleSave}
            onClose={() => this.setState({ isOpen: false })}
          />
        }
      </TouchableOpacity>

    );
  }
}
const styles = StyleSheet.create({
  sigContainer: {
    padding: 10,
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: "flex-start",
    alignItems: "flex-end"
  },
  sig: {
    justifyContent: "center",
    alignItems: "center",
    minWidth: 80,
    borderBottomWidth: 1,
    borderColor: 'black'
  }
});
