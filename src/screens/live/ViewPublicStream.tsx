import React, { useEffect, useState } from "react";
import { Button, View, Heading, Alert } from "native-base";
import { connect } from "react-redux";
import { IPerformer, IUser } from "../../interfaces";
import { messageService, streamService } from "../../services";
import { PermissionsAndroid } from "react-native";
import {
  PERMISSIONS,
  requestMultiple,
  RESULTS,
} from "react-native-permissions";
import socketHolder from "lib/socketHolder";

import {
  getStreamConversation,
  resetStreamMessage,
  loadStreamMessages,
  getStreamConversationSuccess,
  resetAllStreamMessage,
} from "services/redux/stream-chat/actions";
import { WEBRTC_ADAPTOR_INFORMATIONS } from "components/antmedia/constants";
import styles from "./style";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderMenu from "components/tab/HeaderMenu";
import { colors } from "utils/theme";
import { isAndroid } from "utils/common";
import { Publisher } from "components/antmedia/Publisher";
import PublisherIOS from "components/antmedia/PublisherIOS";
import ChatBox from "components/streamChat/chat-box";
import EmojiSelector from "react-native-emoji-selector";
import GiftPage from "components/gift/GiftPage";
import { giftService } from "services/index";
import { performerService } from "services/perfomer.service";
import { StreamSettings, HLS, WEBRTC, PUBLIC_CHAT } from "../../interfaces";

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
  route :any;
  settings: StreamSettings;
  loadStreamMessages: Function;
  getStreamConversationSuccess: Function;
  resetAllStreamMessage: Function;
}

enum STREAM_EVENT {
  JOIN_BROADCASTER = 'join-broadcaster',
  MODEL_LEFT = 'model-left',
  ROOM_INFORMATIOM_CHANGED = 'public-room-changed'
}

const ViewPublicStream = ({
  resetStreamMessage,
  getStreamConversation: dispatchLoadStreamMessages,
  getStreamConversationSuccess: dispatchGetStreamConversationSuccess,
  activeConversation,
  currentUser,
  system,
  settings,
  route
}: IProps) => {
  let subscrbierRef: any;

  let subscriberRef2: any;
  let interval: NodeJS.Timeout;

  const { performer } = route.params;


  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [sessionId, setSessionid] = useState(null) as any;
  const [total, setTotal] = useState(0);
  const [members, setMembers] = useState([]);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [localStreamId, setLocalStreamId] = useState(null as any);
  const [favoriteGift, setFavoriteGift] = useState({});

  useEffect(() => {
    getfavoriteGift();
    interval = setInterval(updatePerformerInfo, 60 * 1000);
    joinPeformerPublicRoom()
    const socket = socketHolder.getSocket() as any;

    socket.on(STREAM_EVENT.JOIN_BROADCASTER,subscribe);
    socket.on(STREAM_EVENT.MODEL_LEFT,modelLeftHandler);
    socket.on(STREAM_EVENT.ROOM_INFORMATIOM_CHANGED,onChange);


    return () => {
      interval && clearInterval(interval)
      leavePublicRoom();
    };
  }, []);

  const subscribe = async({ performerId }) => {
    const {optionForBroadcast} =settings
    try {

      const resp = await streamService.joinPublicChat(performerId);
      const { sessionId } = resp.data;
      if (optionForBroadcast === HLS) {
        if (subscrbierRef.current?.playHLS) subscrbierRef.current?.playHLS(sessionId);
        else if (subscriberRef2.playHLS) subscriberRef2.playHLS(sessionId);
      }

      if (optionForBroadcast === WEBRTC) {
        if (subscrbierRef.current?.play) subscrbierRef.current.play(sessionId);
        else if (subscriberRef2.play) subscriberRef2.play(sessionId);
      }
    } catch (err) {
      const error = await Promise.resolve(err);
    }
  }

  const leavePublicRoom = () => {
    const socket = socketHolder.getSocket() as any;
    console.log("Stop");

    if (socket && activeConversation && activeConversation.data) {
      const conversation = { ...activeConversation.data };
      socket.emit("public-stream/leave", { conversationId: conversation._id });
      resetStreamMessage();
      setSessionid(null);
      setInitialized(false);
    }
  };
  const onChange =({ total, members, conversationId }) => {
    if (activeConversation?.data?._id && activeConversation.data._id === conversationId) {
      setTotal(total);
      setMembers(members)
    }
  }

  const getfavoriteGift = async () => {
    const respGift = await (await giftService.favoriteGift()).data;
    setFavoriteGift(respGift.data[0]);
  };

  const favoriteHandle=(gift) => {
    setFavoriteGift(gift)
    giftService.addfavoriteGift({ giftId: gift._id });
  }

  const updatePerformerInfo = async () => {
    try {
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
      console.log(error);
    }
  };

  const joinPeformerPublicRoom = async () => {


    const socket = socketHolder.getSocket() as any;
    if (performer) {
      try {
        const resp = await messageService.findPublicConversationPerformer(
          performer._id
        );
        const {streamId}=resp.data
      const { sessionId } = resp.data;
      console.log("Stream", resp.data);




        const conversation = resp.data;
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
            setLocalStreamId(streamId)
        await setSessionid(sessionId);


        } else {
          throw new Promise((resolve) =>
            resolve("No available broadcast. Try again later")
          );
        }
      } catch (e) {
        const error = await Promise.resolve(e);
      }
    }
  };

  const modelLeftHandler = ({ performerId }) => {
    if (performerId !== performer._id) {
      return;
    }

    if (subscrbierRef.current?.stop) subscrbierRef.current.stop();
    else subscriberRef2.stop();

    Alert('Model has left the room!');
  }
  const renderLocalVideo = () => {
    console.log("renderLocalVideo",localStreamId);
    if (isAndroid()) {
      return <Publisher streamId={localStreamId} onChange={() => {}} />;
    }

    return <PublisherIOS streamId={localStreamId} />;
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
      <View>

      <View flex={1}>{ renderLocalVideo()}</View>

      </View>

      <HeaderMenu />
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.user.current,
  activeConversation: state.streamMessage.activeConversation,
  system: { ...state.system },
});
const mapDispatch = {
  loadStreamMessages,
  getStreamConversationSuccess,
  resetStreamMessage,
  resetAllStreamMessage,
};
export default connect(mapStateToProps, mapDispatch)(ViewPublicStream);
