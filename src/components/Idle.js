import React from 'react';
import { View, Image, Text } from 'react-native';
import images from '_src/assets/images';

const Idle = ({ text }) => {
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Image source={images.icon} style={styles.image}/>
        <Text style={styles.text}>{text || 'idle'}</Text>
      </View>
    </View>
  );
};

const styles = {
  container: {
    width: '100%',
    height: '100%',
  },
  main: {
    width: 200,
    height: 200,
    left: '50%',
    top: '50%',
    marginTop: -150,
    marginLeft: -100,
    alignItems: 'center',
    justifyContent:'center',
  },
  image: {
    width: 120,
    height: 114
  },
  text: {
    marginTop: 10,
    fontSize: 40
  }
};

export default Idle;
