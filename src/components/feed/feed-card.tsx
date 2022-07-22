import { View } from 'native-base';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import Video from 'react-native-video';
import styles from './style';

interface IProps {
  url: string;
  resizeMode?: string;
  ref?: any;
}

export const FeedCard = forwardRef(({ url, resizeMode }: IProps, parentRef) => {
  const [playing, setPlaying] = useState(false);
  const ref = useRef(null) as any;
  useImperativeHandle(parentRef, () => ({
    play,
    pause
  }));

  useEffect(() => {
    return () => ref.current.seek(0);
  }, []);

  const play = async () => {
    if (!playing) {
      setPlaying(true);
    }
  };

  const pause = async () => {
    if (playing) {
      setPlaying(false);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={() => (!playing ? play() : pause())}>
      <Video
        ref={ref}
        source={{ uri: url }} // Can be a URL or a local file.
        style={styles.container}
        resizeMode={resizeMode || 'cover'}
        paused={!playing}
        repeat
      />
    </TouchableWithoutFeedback>
  );
});

export default FeedCard;
