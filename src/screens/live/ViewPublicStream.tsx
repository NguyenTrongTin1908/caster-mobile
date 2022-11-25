import React, { useEffect, useState } from "react";
import { Button, View, Heading, Text } from "native-base";
import { connect } from "react-redux";
import { IPerformer, IUser } from "../../interfaces";
import { messageService, streamService } from "../../services";
import { Alert } from "react-native";
import socketHolder from "lib/socketHolder";

import {
  getStreamConversation,
  resetStreamMessage,
  loadStreamMessages,
  getStreamConversationSuccess,
  resetAllStreamMessage,
} from "services/redux/stream-chat/actions";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderMenu from "components/tab/HeaderMenu";
import { colors, Sizes } from "utils/theme";
import { performerService } from "services/perfomer.service";
import { StreamSettings, HLS, WEBRTC, PUBLIC_CHAT } from "../../interfaces";
import { HLSViewer } from "components/antmedia/HLSViewer";
import ChatBox from "components/streamChat/chat-box";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import dismissKeyboard from "react-native/Libraries/Utilities/dismissKeyboard";
import KeyboardDismiss from "components/uis/KeyboardDismiss";
// eslint-disable-next-line no-shadow
// enum EVENT_NAME {
//   ROOM_INFORMATIOM_CHANGED = "public-room-changed",
// }
interface IProps {
  resetStreamMessage: Function;
  getStreamConversation: Function;
  activeConversation: any;
  currentUser: IPerformer;
  system: any;
  route: any;
  settings: StreamSettings;
  loadStreamMessages: Function;
  getStreamConversationSuccess: Function;
  resetAllStreamMessage: Function;
}

enum STREAM_EVENT {
  JOIN_BROADCASTER = "join-broadcaster",
  MODEL_LEFT = "model-left",
  ROOM_INFORMATIOM_CHANGED = "public-room-changed",
}
let conversationHolder;
let subscrbierRef: any;
let subscriberRef2: any;
let interval: NodeJS.Timeout;

const ViewPublicStream = ({
  resetStreamMessage,
  loadStreamMessages: dispatchLoadStreamMessages,
  getStreamConversationSuccess: dispatchGetStreamConversationSuccess,
  activeConversation,
  currentUser,
  system,
  settings,
  route,
}: IProps) => {
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [sessionId, setSessionid] = useState(null) as any;
  const [total, setTotal] = useState(0);
  const [members, setMembers] = useState([]);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [localStreamId, setLocalStreamId] = useState(null as any);

  useEffect(() => {
    interval = setInterval(updatePerformerInfo, 60 * 1000);
    joinPerformerPublicRoom();
    const socket = socketHolder.getSocket() as any;

    socket.on(STREAM_EVENT.JOIN_BROADCASTER, subscribe);

    socket.on(STREAM_EVENT.MODEL_LEFT, modelLeftHandler);
    socket.on(STREAM_EVENT.ROOM_INFORMATIOM_CHANGED, onChange);

    return () => {
      interval && clearInterval(interval);
      handleSocketLeave();
    };
  }, []);

  const subscribe = async ({ performerId }) => {
    console.log(STREAM_EVENT.JOIN_BROADCASTER + ">>>>>>>>", performerId);
    const { optionForBroadcast } = settings;
    try {
      const resp = await streamService.joinPublicChat(performerId);
      const { sessionId } = resp.data;
      if (optionForBroadcast === HLS) {
        // if (subscrbierRef.current?.playHLS) subscrbierRef.current?.playHLS(sessionId);
        // else if (subscriberRef2.playHLS) subscriberRef2.playHLS(sessionId);
        if (!subscriberRef2.playing) {
          await subscriberRef2.playHLS();
          onChange;
        }
      }

      if (optionForBroadcast === WEBRTC) {
        if (subscrbierRef.current?.play) subscrbierRef.current.play(sessionId);
        else if (subscriberRef2.play) subscriberRef2.play(sessionId);
      }
    } catch (err) {
      const error = await Promise.resolve(err);
    }
  };

  const handleSocketLeave = () => {
    // TODO - handle me
    const socket = socketHolder.getSocket() as any;
    const conversationId =
      activeConversation?.data?._id || conversationHolder?._id;
    if (conversationId) {
      socket.emit("public-stream/leave", { conversationId });
      resetStreamMessage();
      setSessionid(null);
      setInitialized(false);
    }
    socket.off(STREAM_EVENT.JOIN_BROADCASTER);
    socket.off(STREAM_EVENT.MODEL_LEFT);
    socket.off(STREAM_EVENT.ROOM_INFORMATIOM_CHANGED);
    conversationHolder = null;
  };

  const onChange = ({ total, members, conversationId }) => {
    console.log("Ra");

    if (activeConversation?.data?._id) {
      console.log("Vooooo");
      setTotal(total);
      setMembers(members);
    }
  };

  const updatePerformerInfo = async () => {
    try {
      const { performer } = route.params;
      const { username, streamingStatus: oldStreamingStatus } = performer;
      const resp = await performerService.findOne(username);
      const { streamingStatus } = resp.data;
      // poster(streamingStatus);
      if (
        oldStreamingStatus !== streamingStatus &&
        streamingStatus === PUBLIC_CHAT
      ) {
        /**
         * Update stream status, broadcast
         */
      }
    } catch (e) {
      const error = await Promise.resolve(e);
      // eslint-disable-next-line no-console
      console.log("error>>>>", error);
    }
  };

  const joinPerformerPublicRoom = async () => {
    const { performer } = route.params;
    const socket = socketHolder.getSocket() as any;
    if (performer) {
      try {
        const resp = await messageService.findPublicConversationPerformer(
          performer._id
        );
        const conversation = resp.data;
        conversationHolder = conversation;
        if (conversation && conversation._id) {
          dispatchGetStreamConversationSuccess({ data: conversation });
          dispatchLoadStreamMessages({
            conversationId: conversation._id,
            limit: 25,
            offset: 0,
            type: conversation.type,
          });
          socket &&
            socket.emit("public-stream/join", {
              conversationId: conversation._id,
            });
        } else {
          throw new Promise((resolve) =>
            resolve("No available broadcast. Try again later")
          );
        }
      } catch (e) {
        const error = await Promise.resolve(e);
        // eslint-disable-next-line no-console
        console.log("error123456>>>>", error);
      }
    }
  };

  const modelLeftHandler = ({ performerId }) => {
    const { performer } = route.params;
    if (performerId !== performer._id) {
      return;
    }

    // subscriberRef2.pause();

    Alert.alert("Model has left the room!");
  };

  const setStreamRef = (dataFunc) => {
    subscriberRef2 = dataFunc;
  };

  return (
    //
    <SafeAreaView style={{ flex: 1 }} onTouchStart={dismissKeyboard}>
      <KeyboardDismiss>
        <>
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

          <View
            style={{
              position: "absolute",
              marginTop: Sizes.fixPadding + 180.0,
              alignItems: "center",
              alignSelf: "flex-end",
              zIndex: 1000,
            }}
          >
            <MaterialIcons name="visibility" color={colors.light} size={28} />
            <Text
              style={{
                marginTop: Sizes.fixPadding - 7.0,
                color: colors.lightText,
              }}
            >
              {total}
            </Text>
          </View>
          <View flex={1} flexDirection={"column"} position={"relative"}>
            <HLSViewer
              streamId={activeConversation?.data?.streamId}
              ref={(viewRef) => setStreamRef(viewRef)}
              settings={settings}
            />
            <ChatBox canSendMessage />
          </View>
          <HeaderMenu />
        </>
      </KeyboardDismiss>
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.user.current,
  activeConversation: state.streamMessage.activeConversation,
  system: { ...state.system },
  settings: { ...state.system.data },
});
const mapDispatch = {
  loadStreamMessages,
  getStreamConversationSuccess,
  resetStreamMessage,
  resetAllStreamMessage,
};
export default connect(mapStateToProps, mapDispatch)(ViewPublicStream);
