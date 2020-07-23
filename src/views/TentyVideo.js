import React from 'react'
import {
  StyleSheet,
} from 'react-native';
import Video from 'react-native-video';

// Within your render function, assuming you have a file called
// "background.mp4" in your project. You can include multiple videos
// on a single screen if you like.

const url = 'https://10t-media-test.s3.cn-northwest-1.amazonaws.com.cn/media/video/bb668de5-dd89-4546-98d5-e2182298545d';


const TentyVideo = () => {
  return (
    <Video
      source={{uri: url}}   // Can be a URL or a local file.
      style={styles.backgroundVideo}
      repeat={true}
    />
  );
};

// Later on in your styles..
var styles = StyleSheet.create({
  backgroundVideo: {
    backgroundColor: 'green',
    width: 400,
    height: 400
  },
});

export default TentyVideo;
