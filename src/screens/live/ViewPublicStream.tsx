import React, { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/core";
import { View, Heading, Text, Image } from "native-base";
import { connect } from "react-redux";
import { IPerformer, IUser } from "../../interfaces";
import { giftService, messageService, streamService } from "../../services";
import {
  Alert,
  Dimensions,
  Platform,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import socketHolder from "lib/socketHolder";

import {
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
import ButtonFollow from "components/uis/ButtonFollow";
import AntDesign from "react-native-vector-icons/AntDesign";
import FavoriteGift from "components/gift/favorite";
import SendTip from "components/message/SendTip";
import BackButton from "components/uis/BackButton";
import { getStatusBarHeight } from "react-native-status-bar-height";
import styles from "./style";
const { width, height } = Dimensions.get("window");
let deviceH = Dimensions.get("screen").height;
const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 24;
let bottomNavBarH = deviceH - height + STATUS_BAR_HEIGHT;
import { ObservableQueue } from "../../hooks/observable-queue";
import { of, delay, Subscription } from "rxjs";
const queue = new ObservableQueue();

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
  settings,
  route,
}: IProps) => {
  const [initialized, setInitialized] = useState(false);
  const [sessionId, setSessionid] = useState(null) as any;
  const [total, setTotal] = useState(0);
  const [members, setMembers] = useState([]);
  const { performer } = route.params;
  const [favoriteGift, setFavoriteGift] = useState({} as any);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const navigation = useNavigation() as any;
  const [imgUrl, setImgUrl] = useState(null) as any;
  const living = useRef() as any;

  useEffect(() => {
    interval = setInterval(updatePerformerInfo, 60 * 1000);
    joinPerformerPublicRoom();
    getfavoriteGift();

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
      socket && socket.off(`message_created_conversation_${conversationId}`);
    }
    socket.off(STREAM_EVENT.JOIN_BROADCASTER);
    socket.off(STREAM_EVENT.MODEL_LEFT);
    socket.off(STREAM_EVENT.ROOM_INFORMATIOM_CHANGED);
    conversationHolder = null;
    living.current = false;
    setImgUrl(null);
  };

  const onChange = ({ total, members, conversationId }) => {
    if (activeConversation?.data?._id) {
      setTotal(total);
      setMembers(members);
    }
  };

  const getfavoriteGift = async () => {
    setLoading(false);
    const respGift = await (await giftService.favoriteGift()).data;
    console.log("Get favorite gift : ", respGift.data[0]);
    setFavoriteGift(respGift.data[0]);
    setLoading(true);
  };

  const favoriteHandle = async (gift) => {
    try {
      if (gift && gift.length > 0) {
        setFavoriteGift(gift[0]);
        console.log("favorite handle : ", gift);

        await giftService.addfavoriteGift({ giftId: gift[0]._id });
      }
    } catch (error) {
      console.log("Error : ", error);
    }
  };

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
      console.log("error>>>>", error);
    }
  };

  const joinPerformerPublicRoom = async () => {
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
          living.current = true;
          socket.on(
            `message_created_conversation_${conversation._id}`,
            (data) => {
              onReceiveGift(data, "created");
            }
          );
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

  const modelLeftHandler = ({ performerId }) => {
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
              top: 50 + getStatusBarHeight(true),
              alignItems: "center",
              alignSelf: "flex-start",
              flexDirection: "row",
              zIndex: 1000,
              marginStart: 2,
            }}
          >
            <View>
              <Text style={styles.textName}>{performer.name}</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate("ModelProfile", {
                    screen: "ModelProfile",
                    performer: performer,
                  })
                }
              >
                <Image
                  source={
                    performer?.avatar
                      ? { uri: performer?.avatar }
                      : require("../../assets/avatar-default.png")
                  }
                  alt={"avatar"}
                  size={45}
                  borderRadius={80}
                />
              </TouchableOpacity>
              <Text style={styles.textName}>
                {performer.stats.totalFollowing} Fans
              </Text>
            </View>
            <View style={{ marginLeft: 5 }}>
              <ButtonFollow
                isHideOnClick
                targetId={performer?._id}
                sourceId={currentUser._id}
                isFollow={performer.isFollowed}
                getPerformerList={() => {}}
              />
            </View>
          </View>
          <View
            style={{
              position: "absolute",
              top:
                Platform.OS === "ios"
                  ? deviceH / 2 - (90 + 47) + 20
                  : deviceH / 2 - (bottomNavBarH + 60) + 20,
              right: Sizes.fixPadding,
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
          <View
            style={{
              position: "absolute",
              top:
                Platform.OS === "ios"
                  ? deviceH / 2 - (90 + 47) + 80
                  : deviceH / 2 - (bottomNavBarH + 60) + 80,
              right: Sizes.fixPadding - 5,
              alignSelf: "flex-end",
              zIndex: 1000,
            }}
          >
            <FavoriteGift
              performerId={activeConversation?.data?.performerId}
              conversationId={activeConversation?.data?._id}
              favorGift={favoriteGift}
            />
          </View>
          <View
            style={{
              position: "absolute",
              top:
                Platform.OS === "ios"
                  ? deviceH / 2 - (90 + 47) + 160
                  : deviceH / 2 - (bottomNavBarH + 60) + 160,
              right: Sizes.fixPadding - 5,
              alignSelf: "flex-end",
              zIndex: 1000,
            }}
          >
            <TouchableOpacity onPress={() => setModal(true)}>
              <AntDesign name="gift" color={colors.light} size={28} />
            </TouchableOpacity>
          </View>
          <View flex={1} flexDirection={"column"} position={"relative"}>
            <HLSViewer
              streamId={activeConversation?.data?.streamId}
              ref={(viewRef) => setStreamRef(viewRef)}
              settings={settings}
            />
            {imgUrl && (
              <Image
                alt={"avatar"}
                source={{
                  uri: imgUrl || "",
                }}
                style={styles.backgroundVideo}
              />
            )}
            <ChatBox canSendMessage />
            {loading && (
              <SendTip
                setModal={setModal}
                aria-label="Send Tip"
                modal={modal}
                conversationId={activeConversation?.data?._id}
                performerId={activeConversation?.data?.performerId || ""}
                saveFavorite={favoriteHandle}
                favorGift={favoriteGift}
              />
            )}
          </View>
          <HeaderMenu />
        </>
      </KeyboardDismiss>
      <BackButton />
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
