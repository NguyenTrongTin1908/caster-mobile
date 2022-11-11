import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import Video from 'react-native-video';
import { IFeed } from 'interfaces/feed';
import styles from './style';
import { feedService } from 'services/feed.service';
interface IProps {
  resizeMode?: string;
  feed: IFeed;
}
export const VideoCard = forwardRef(({ resizeMode, feed: { files, thumbnail, _id } }: IProps, parentRef) => {
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
    if (!playing && viewable) {
      play();
    } else {
      pause();
    }
  }, [viewable]);
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
  const setStatus = isViewable => {
    setIsViewable(isViewable);
  };
  const onReady = () => {
    setReady(true);
  };
  const countView = () => {
    feedService.addView(_id);
  };

  return (
    <Video
      ref={ref}
      source={{ uri: files[0]?.url }} // Can be a URL or a local file. files[0]?.url
      style={styles.container}
      resizeMode={resizeMode || 'cover'}
      paused={playing ? false : true}
      repeat
      poster={
        thumbnail?.url ||
        (files?.length > 0 && files[0].thumbnails && files[0].thumbnails.length > 0 && files[0].thumbnails[0])
      }
      posterResizeMode={'cover'}
      onReadyForDisplay={onReady}
      onEnd={countView}
    />
  );
});
export default VideoCard;
