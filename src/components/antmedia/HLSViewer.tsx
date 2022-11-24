import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { StyleSheet } from "react-native";
import { View, Text } from "native-base";
import Video from "react-native-video";
import { messageService, streamService } from "../../services";
import { StreamSettings } from "interfaces/stream";
interface IProps {
  streamId?: string;
  onJoined?: Function;
  settings: StreamSettings;
}
let getLiveStreamOrVodURLInterval: any;
export const HLSViewer = forwardRef(
  ({ streamId, onJoined = () => {}, settings }: IProps, parentRef) => {
    const [playing, setPlaying] = useState(false);
    const [readyForPlay, setReady] = useState(false);
    const [uri, setUri] = useState("");
    const [videoKey, setVideoKey] = useState(0);
    const ref = useRef(null) as any;

    useEffect(() => {
      playHLS();
      return () => {
        pause();
        if (getLiveStreamOrVodURLInterval) {
          clearInterval(getLiveStreamOrVodURLInterval);
          getLiveStreamOrVodURLInterval = null;
        }
      };
    }, []);

    useEffect(() => {
      if (readyForPlay) {
        play();
      }
    }, [readyForPlay]);

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

    const onReady = () => {
      setReady(true);
    };

    const ended = async () => {
      if (!streamId) {
        resetPlaybackVideo();
        return;
      }
      setVideoKey(0);
      pause();
      const src = await streamService.getLiveStreamOrVodURL({
        streamId,
        settings,
        appName: settings.AntMediaAppname,
      });
      if (src) {
        getLiveStreamOrVodURLInterval = setInterval(() => {
          fetch(src, { method: "HEAD" }).then(() => {
            playHLS();
          });
        }, 5000);
      }
    };

    const resetPlaybackVideo = () => {
      if (getLiveStreamOrVodURLInterval) {
        clearInterval(getLiveStreamOrVodURLInterval);
        getLiveStreamOrVodURLInterval = null;
        setUri("");
      }
    };

    const playHLS = async (streamHeight = 0) => {
      if (!streamId) {
        return;
      }

      if (getLiveStreamOrVodURLInterval) {
        clearInterval(getLiveStreamOrVodURLInterval);
        getLiveStreamOrVodURLInterval = null;
      }

      const appName = settings.AntMediaAppname;
      const src = await streamService.getLiveStreamOrVodURL(
        {
          appName,
          settings,
          streamId,
        },
        streamHeight
      );
      if (!src) {
        return;
      }
      setUri(src);
      setVideoKey(videoKey + 1);
      setTimeout(() => {
        play();
      }, 500);
    };

    useImperativeHandle(parentRef, () => ({
      play,
      playing,
      pause,
      playHLS,
    }));

    const renderVideo = () => {
      if (!uri)
        return (
          <Text color={"red.200"} textAlign={"center"}>
            Waiting for loading stream..
          </Text>
        );
      return (
        <Video
          key={videoKey}
          ref={ref}
          source={{ uri: uri }}
          resizeMode={"contain"}
          style={{
            position: "absolute",
            minHeight: 400,
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
          }}
          paused={playing ? false : true}
          onReadyForDisplay={onReady}
          onEnd={ended}
          autoplay
        />
      );
    };

    return (
      <View flex={1} justifyContent={"center"}>
        {renderVideo()}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  bottom: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-evenly",
    marginBottom: 30,
  },
});
