import React, { useEffect, useRef, useState } from "react";
import { Button, View, Heading, Text, Image } from "native-base";
import { connect } from "react-redux";
import { IUser } from "src/interfaces";
import { streamService } from "../../services";
import { PermissionsAndroid, TouchableWithoutFeedback } from "react-native";
import {
  PERMISSIONS,
  requestMultiple,
  RESULTS,
} from "react-native-permissions";
import socketHolder from "lib/socketHolder";
import {
  getStreamConversation,
  resetStreamMessage,
} from "services/redux/stream-chat/actions";
import { WEBRTC_ADAPTOR_INFORMATIONS } from "components/antmedia/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, Sizes } from "utils/theme";
import { isAndroid } from "utils/common";
import { Publisher } from "components/antmedia/Publisher";
import ChatBox from "components/streamChat/chat-box";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import BackButton from "components/uis/BackButton"; // import EmojiSelector from "react-native-emoji-selector";
import styles from "./style";
import { ObservableQueue } from "../../hooks/observable-queue";
import { of, delay, Subscription } from "rxjs";
const queue = new ObservableQueue();

interface IProps {
  resetStreamMessage: Function;
  getStreamConversation: Function;
  activeConversation: any;
  currentUser: IUser;
  system: any;
}

const PublicStream = ({
  resetStreamMessage,
  getStreamConversation,
  activeConversation,
}: IProps) => {
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [sessionId, setSessionid] = useState(null) as any;
  const [total, setTotal] = useState(0);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [localStreamId, setLocalStreamId] = useState(null as any);
  const [isMuteAudio, setMuteAudio] = useState(false);
  const [imgUrl, setImgUrl] = useState(null) as any;
  const living = useRef() as any;
  useEffect(() => {
    askPermissions();
    const socket = socketHolder.getSocket() as any;
    setImgUrl(null);
    if (socket && activeConversation.data) {
      living.current = true;
      const conversation = { ...activeConversation.data };
      socket.on(`message_created_conversation_${conversation._id}`, (data) => {
        onReceiveGift(data, "created");
      });
      socket.on("public-room-changed", handler);
    }
    return () => {
      if (socket && activeConversation.data) {
        const conversation = { ...activeConversation.data };
        socket &&
          socket.off(`message_created_conversation_${conversation._id}`);
        leavePublicRoom();
      }
    };
  }, [activeConversation]);

  function createObservable(data, playingTime) {
    return of(data).pipe(delay(playingTime));
  }

  function addNew(data: any, playingTime: number) {
    const original = createObservable(data, playingTime);
    return queue.addItem(original);
  }

  async function render(result) {
    result && living.current ? setImgUrl(result.url) : setImgUrl(null);
  }

  const onReceiveGift = async (message, type) => {
    const { duration, clip } = (message?.meta && message?.meta?.gift) || 0;
    const data = {
      url: clip && clip.url,
    };
    addNew(data, 0).subscribe(render);
    addNew(null, (duration || 0) * 1000).subscribe(render);
  };

  const askAndroidPerissions = async () => {
    const cameraGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: "Camera Permission",
        message:
          "Application needs access to your camera " +
          "so you can start video call.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    );
    const audioGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: "Record Audio Permission",
        message:
          "Application needs access to your audio " +
          "so you can start video call.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    );
    return {
      cameraGranted: cameraGranted === PermissionsAndroid.RESULTS.GRANTED,
      audioGranted: audioGranted === PermissionsAndroid.RESULTS.GRANTED,
    };
  };
  const askIOSPermissions = async () => {
    const statuses = await requestMultiple([
      PERMISSIONS.IOS.CAMERA,
      PERMISSIONS.IOS.MICROPHONE,
    ]);
    return {
      cameraGranted: statuses[PERMISSIONS.IOS.CAMERA] === RESULTS.GRANTED,
      audioGranted: statuses[PERMISSIONS.IOS.MICROPHONE] === RESULTS.GRANTED,
    };
  };

  const askPermissions = async () => {
    const { cameraGranted, audioGranted } = isAndroid()
      ? await askAndroidPerissions()
      : await askIOSPermissions();
    if (cameraGranted && audioGranted) {
      setPermissionGranted(true);
    } else {
    }
  };

  const stop = () => {
    if (!initialized) {
      return;
    }
    leavePublicRoom();
  };
  const callback = (info: WEBRTC_ADAPTOR_INFORMATIONS) => {
    if (activeConversation && activeConversation.data) {
      // const socket = this.context;
      const socket = socketHolder.getSocket() as any;
      if (info === WEBRTC_ADAPTOR_INFORMATIONS.INITIALIZED) {
        setInitialized(true);
        // if (publisherRef.publish) publisherRef.publish(sessionId);
        // else publisherRef2.publish(sessionId);
      } else if (info === WEBRTC_ADAPTOR_INFORMATIONS.PUBLISH_STARTED) {
        const conversation = { ...activeConversation.data };
        socket.emit("public-stream/live", { conversationId: conversation._id });
        setLoading(false);
      } else if (info === WEBRTC_ADAPTOR_INFORMATIONS.PUBLISH_FINISHED) {
        setLoading(false);
      } else if (info === WEBRTC_ADAPTOR_INFORMATIONS.CLOSED) {
        setLoading(false);
        setInitialized(false);
      }
    }
  };
  const joinPublicRoom = async () => {
    const socket = socketHolder.getSocket() as any;
    try {
      setLoading(true);
      const resp = await streamService.goLive();
      const { conversation, sessionId } = resp.data;
      const { streamId } = conversation;
      if (conversation && conversation._id) {
        living.current = true;
        getStreamConversation({
          conversation,
        });
        socket &&
          (await socket.emit("public-stream/join", {
            conversationId: conversation._id,
          }));
        socket &&
          (await socket.emit("public-stream/live", {
            conversationId: conversation._id,
          }));
        setLocalStreamId(streamId);
        await setSessionid(sessionId);
      }
    } catch (e) {
      const error = await Promise.resolve(e);
    } finally {
      setLoading(false);
    }
  };

  const leavePublicRoom = () => {
    const socket = socketHolder.getSocket() as any;
    if (socket && activeConversation && activeConversation.data) {
      const conversation = { ...activeConversation.data };
      socket.emit("public-stream/leave", { conversationId: conversation._id });
      resetStreamMessage();
      setSessionid(null);
      setInitialized(false);
    }
    living.current = false;
    setImgUrl(null);
  };
  const start = async () => {
    setLoading(true);
    try {
      setInitialized(true);
      joinPublicRoom();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log("error_broadcast", await e);
    } finally {
      setLoading(false);
    }
  };
  const handler = ({ total, members }) => {
    setTotal(total);
  };

  const renderLocalVideo = () => {
    return (
      <Publisher
        isMuteAudio={isMuteAudio}
        streamId={localStreamId}
        onChange={callback}
      />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Heading
        mb={4}
        fontSize={30}
        textAlign="center"
        letterSpacing={-1}
        color={colors.lightText}
        bold
      >
        Live Broadcaster
      </Heading>
      <BackButton />
      {sessionId && (
        <View style={styles.rightBarStream}>
          <MaterialIcons name="visibility" color={"red"} size={28} />
          <Text style={styles.textName}>{total}</Text>
          <TouchableWithoutFeedback onPress={() => setMuteAudio(!isMuteAudio)}>
            {isMuteAudio ? (
              <MaterialIcons
                style={styles.iconStream}
                name="mic-off"
                color={"red"}
                size={28}
              />
            ) : (
              <MaterialIcons
                style={styles.iconStream}
                name="mic"
                color={"red"}
                size={28}
              />
            )}
          </TouchableWithoutFeedback>
          <Button style={styles.btnEndStream} onPress={() => stop()}>
            End Now
          </Button>
        </View>
      )}
      <View flex={1} flexDirection={"column"} position={"relative"}>
        {sessionId && renderLocalVideo()}
        {imgUrl && (
          <Image
            alt={"avatar"}
            source={{
              uri: imgUrl || "",
            }}
            style={styles.backgroundVideo}
          />
        )}
        {sessionId && <ChatBox canSendMessage={false} />}
      </View>
      <View>
        {!initialized ? (
          <Button onPress={() => start()}>Start Streaming</Button>
        ) : (
          <Button onPress={() => stop()}>Stop Streaming</Button>
        )}
      </View>
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.user.current,
  activeConversation: state.streamMessage.activeConversation,
  system: { ...state.system },
});
const mapDispatchs = {
  getStreamConversation,
  resetStreamMessage,
};
export default connect(mapStateToProps, mapDispatchs)(PublicStream);
