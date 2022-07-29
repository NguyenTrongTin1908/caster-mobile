import { View } from 'native-base';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import Video from 'react-native-video';
import { IFeed } from 'interfaces/feed';
import styles from './style';

interface IProps {
  resizeMode?: string;
  ref?: any;
  feed: IFeed;
}

export const FeedCard = forwardRef(({ resizeMode, feed: { files, thumbnail } }: IProps, parentRef) => {
  const [playing, setPlaying] = useState(false);
  const [readyForPlay, setReady] = useState(false);
  const [viewable, setIsViewable] = useState(false);
  const ref = useRef(null) as any;
  useImperativeHandle(parentRef, () => ({
    play,
    pause,
    setStatus,
    playing
  }));

  useEffect(() => {
    return () => ref.current.seek(0);
  }, []);

  useEffect(() => {
    if (!playing && viewable && readyForPlay) {
      play();
    } else {
      pause();
    }
  }, [readyForPlay, viewable]);

  const play = async () => {
    if (!playing && readyForPlay) {
      setPlaying(true);
    }
  };
  const pause = async () => {
    if (playing) {
      setPlaying(false);
    }
  };

  const setStatus = isViewable => {
    setIsViewable(isViewable);
  };

  const onReady = () => {
    setReady(true);
  };
  return (
    <Video
      ref={ref}
      source={{ uri: files[0]?.url }} // Can be a URL or a local file.
      style={styles.container}
      resizeMode={resizeMode || 'cover'}
      paused={playing ? false : true}
      repeat
      poster={
        thumbnail?.url ||
        (files?.length > 0 && files[0].thumbnails && files[0].thumbnails.length > 0 && files[0].thumbnails[0])
      }
      posterResizeMode={'cover'}
      onReadyForDisplay={ready => onReady()}
    />
  );
});

export default FeedCard;
