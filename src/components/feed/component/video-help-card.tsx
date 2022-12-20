import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { IFeed } from "interfaces/feed";
import styles from "./style";
import { feedService } from "services/feed.service";
import VideoPlayer from "react-native-video-controls";
import { ScrollView, View } from "native-base";

interface IProps {
  resizeMode?: string;
  feed: IFeed;
  controls?: boolean;
}

export const VideoHelpCard = forwardRef(
  (
    { resizeMode, feed: { files, thumbnail, _id }, controls = false }: IProps,
    parentRef
  ) => {
    const [playing, setPlaying] = useState(false);
    const [readyForPlay, setReady] = useState(false);
    const [viewable, setIsViewable] = useState(false);
    const [fullScreen, setFullScreen] = useState(false);
    const ref = useRef(null) as any;

    useImperativeHandle(parentRef, () => ({
      play,
      pause,
      setStatus,
      playing,
    }));

    useEffect(() => {
      return () => ref?.current?.seek(0);
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
    const setStatus = (isViewable) => {
      setIsViewable(isViewable);
    };
    const onReady = () => {
      setReady(true);
    };
    const countView = () => {
      feedService.addView(_id);
    };

    const FullScreen = () => {
      console.log("Voooo");
      // if (fullScreen) {
      //   Orientation.lockToPortrait();
      // } else {
      //   Orientation.lockToLandscape();
      // }
      setFullScreen(!fullScreen);
    };

    return (
      // <VideoPlayer
      //   ref={ref}
      //   video={{ uri: files[0]?.url }} // Can be a URL or a local file. files[0]?.url
      //   style={styles.container}
      //   resizeMode={resizeMode || "cover"}
      //   paused={playing ? false : true}
      //   repeat
      //   poster={
      //     thumbnail?.url ||
      //     (files?.length > 0 &&
      //       files[0].thumbnails &&
      //       files[0].thumbnails.length > 0 &&
      //       files[0].thumbnails[0])
      //   }
      //   controls={controls}
      //   posterResizeMode={"cover"}
      //   onReadyForDisplay={onReady}
      //   onEnd={countView}
      // />
      <View style={fullScreen ? styles.fullscreenVideoHelp : styles.videoHelp}>
        <VideoPlayer
          ref={ref}
          source={{ uri: files[0]?.url }} // Can be a URL or a local file. files[0]?.url
          // style={styles.container}
          // resizeMode={resizeMode || "cover"}
          paused={playing ? false : true}
          repeat
          fullscreen={fullScreen}
          onEnterFullscreen={FullScreen}

          // style={{ ...StyleSheet.absoluteFill }}
        />
      </View>
    );
  }
);
export default VideoHelpCard;
