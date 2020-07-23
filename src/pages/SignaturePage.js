import React, {Component} from 'react';
import {View} from 'react-native';
import SignaturePad from 'react-native-signature-pad';

export default class SignaturePage extends Component {
  render = () => {
    return (
      <View style={{flex: 1}}>
          <SignaturePad onError={this._signaturePadError}
                        onChange={this._signaturePadChange}
                        style={{flex: 1, backgroundColor: 'white'}}/>
      </View>
    )
  };

  _signaturePadError = (error) => {
    console.error(error);
  };

  _signaturePadChange = ({base64DataUrl}) => {
    console.log("Got new signature: " + base64DataUrl);
  };
}
