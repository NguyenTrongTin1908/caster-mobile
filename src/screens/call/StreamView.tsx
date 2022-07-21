import React, { memo } from 'react';
import { RTCView } from 'react-native-webrtc';

const StreamView = memo(({ stream, ...rest }: any) => {
  return (
    <RTCView
      style={styles.stream}
      objectFit="cover"
      streamURL={stream}
      {...rest}
    />
  );
});

const styles = {
  stream: {
    flex: 1
  }
};

export default StreamView;
