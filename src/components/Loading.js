import React from 'react';
import { View, ActivityIndicator } from 'react-native';

const Loading = ({ size, color }) => {
  return (
    <View style={styles.spinnerContainer}>
      <ActivityIndicator size="large" color={color || '#7fb84f'}/>
    </View>
  );
};

const styles = {
  spinnerContainer: {
  }
};

export default Loading;
