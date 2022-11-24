import React, { useEffect, useRef, useState } from "react";
import { PermissionsAndroid, SafeAreaView, StyleSheet } from "react-native";
import {
  PERMISSIONS,
  requestMultiple,
  RESULTS,
} from "react-native-permissions";
import { Text, View, Heading, HStack } from "native-base";
import Button from "components/uis/Button";

import { tokenService } from "services/token.service";
import socketHolder from "lib/socketHolder";
import { Private } from "components/antmedia/Private";
import { Viewer } from "components/antmedia/Viewer";
import { StreamSettings, HLS, WEBRTC, PUBLIC_CHAT } from "../../interfaces";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/core";
import { isAndroid } from "utils/common";
import PublisherIOS from "components/antmedia/PublisherIOS";
import { connect } from "react-redux";
import { HLSViewer } from "components/antmedia/HLSViewer";
import HeaderMenu from "components/tab/HeaderMenu";
import { colors, Sizes } from "utils/theme";
import { streamService } from "services/stream.service";
import { accessPrivateRequest } from "services/redux/streaming/actions";
import { SocketContext, Event } from "../../socket";
import { updateBalance } from "services/redux/user/actions";
import {
  getStreamConversationSuccess,
  resetStreamMessage,
} from "services/redux/stream-chat/actions";
import EmojiSelector from "react-native-emoji-selector";
import Ionicons from "react-native-vector-icons/Ionicons";
import modal from "components/comment/modal";
import ChatFooter from "components/message/ChatFooter";
import SendTip from "components/message/SendTip";
import { sendMessagePrivateStream } from "services/redux/chatRoom/actions";

enum EVENT {
  JOINED_THE_ROOM = "JOINED_THE_ROOM",
  JOIN_ROOM = "JOIN_ROOM",
  LEAVE_ROOM = "LEAVE_ROOM",
  STREAM_INFORMATION_CHANGED = "private-stream/streamInformationChanged",
  MODEL_JOIN_ROOM = "MODEL_JOIN_ROOM",
  SEND_PAID_TOKEN = "SEND_PAID_TOKEN",
}
interface IProps {
  localStreamId: string;
  route: any;
  settings: any;
  remoteStreamId: any;
  accessPrivateRequest: Function;
  getStreamConversationSuccess: Function;
  resetStreamMessage: Function;
  updateBalance: Function;
  currentUser: any;
}

let privateRequestHolder;
let chargerTimeout;

const PrivateChat = ({
  route,
  settings,
  accessPrivateRequest,
  getStreamConversationSuccess: dispatchGetStreamConversationSuccess,
  resetStreamMessage,
  updateBalance,
  currentUser,
}: IProps) => {
  const navigation = useNavigation() as any;
  let subscrbierRef: any;
  let subscriberRef2: any;

  const { performer, conversationId } = route.params;
  const [roomJoined, setRoomJoined] = useState(false);
  const [modal, setModal] = useState(false);
  const [callTime, setCallTime] = useState(0);
  const [receivedToken, setReceivedToken] = useState(0);
  const [total, setTotal] = useState(0);
  const [members, setMembers] = useState([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const inputText = useRef("");
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [privateRequest, setPrivateRequest] = useState({} as any);
  const localStreamRef = useRef({ id: "" }).current;
  const remoteStreamRef = useRef({
    id: "",
  }).current;

  useEffect(() => {
    askPermissions();
    return () => {
      privateRequestHolder = null;
      chargerTimeout && clearTimeout(chargerTimeout);
      handleSocketLeave();
    };
  }, []);

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
      // TODO - check me here
    }
  };

  const acceptRequest = async () => {
    if (!conversationId) return;
    const socket = socketHolder.getSocket() as any;

    try {
      const resp = await streamService.acceptPrivateChat(conversationId);
      if (resp && resp.data) {
        const { sessionId, conversation } = resp.data;
        await socket.emit(EVENT.JOIN_ROOM, {
          conversationId: conversation._id,
        });

        socket.on(EVENT.STREAM_INFORMATION_CHANGED, ({ total, members }) => {
          setTotal(total);
          setMembers(members);
        });
        dispatchGetStreamConversationSuccess({
          data: conversation,
        });
      }
    } catch (e) {
      const error = await Promise.resolve(e);
    }
  };

  const handleSocketLeave = () => {
    // TODO - handle me
    const socket = socketHolder.getSocket() as any;
    socket.off(EVENT.JOINED_THE_ROOM);
    socket.off("private-stream/streamJoined");
    socket.off(EVENT.MODEL_JOIN_ROOM);
    const conversationId =
      privateRequest?.conversation?._id ||
      privateRequestHolder?.conversation?._id;
    if (conversationId) {
      socket.emit("private-stream/leave", {
        conversationId,
        streamId: localStreamRef.id,
      });
      socket.emit(EVENT.LEAVE_ROOM, {
        conversationId,
      });
    }
  };
  const setStreamRef = (dataFunc) => {
    subscriberRef2 = dataFunc;
  };

  const hangUp = async () => {
    // TODO - send socket event to stop, wait for local stream stop then navigate
    privateRequestHolder = null;
    chargerTimeout && (await clearTimeout(chargerTimeout));
    await handleSocketLeave();
    navigation.navigate("Model", {});
  };

  const chargeInterval = async () => {
    try {
      const conversationId =
        privateRequest?.conversation?._id ||
        privateRequestHolder?.conversation?._id;
      if (!conversationId) throw new Error("Cannot find conversation!");
      await tokenService.sendPaidToken(conversationId);

      chargerTimeout = setTimeout(() => chargeInterval(), 60 * 1000);
    } catch (e) {
      // console.log('charge error', e);
      hangUp();
    }
  };
  const onSelectEmoji = (emoji) => {
    inputText.current = `${inputText.current}${emoji}`;
    setShowEmoji(false);
  };

  const onPressEmoji = (currentText) => {
    inputText.current = currentText || "";
    setShowEmoji(true);
  };
  const ButtonPrivateChatDetail = ({ ...props }) => (
    <HStack my={3} space={2} alignSelf="center">
      <Button {...props} />
    </HStack>
  );

  // const renderLocalVideo = () => {
  //   if (!localStreamId) return null;

  //   if (isAndroid()) {
  //     return <Private streamId={localStreamId} />;
  //   }

  //   return <PublisherIOS streamId={localStreamId} />;
  // };

  // const renderPerformerVideo = () => {
  //   const { optionForBroadcast } = settings;
  //   if (!remoteStreamRef.id) return null;
  //   return optionForBroadcast === WEBRTC
  //     ? !!remoteStreamRef.id && (
  //         <Viewer streamId={remoteStreamRef.id} onJoined={chargeInterval} />
  //       )
  //     : !!remoteStreamRef.id && (
  //         <HLSViewer
  //           streamId={remoteStreamRef.id}
  //           ref={(viewRef) => setStreamRef(viewRef)}
  //           settings={settings}
  //         />
  //       );
  // };

  if (!permissionGranted)
    return (
      <View>
        <Text>
          You need to provide video and audio permission to start the call
        </Text>
        <TouchableOpacity onPress={askPermissions}>
          <Text>Send request</Text>
        </TouchableOpacity>
      </View>
    );

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
        Private Chat
      </Heading>
      <View flex={1}>
        {/* {renderLocalVideo()}

        {renderPerformerVideo()} */}
      </View>
      {showEmoji && <EmojiSelector onEmojiSelected={onSelectEmoji} />}
      {!showEmoji && (
        <ChatFooter
          authUser={currentUser}
          conversationId={conversationId}
          Button={ButtonPrivateChatDetail}
          setModal={setModal}
          sendMessageStream={sendMessagePrivateStream}
          PrivateBtnSendMessage={({ ...props }) => (
            <Ionicons
              name="send-outline"
              size={34}
              style={{
                width: 50,
                paddingHorizontal: 10,
                alignItems: "center",
              }}
              color="#ff8284"
              {...props}
            />
          )}
          onPressEmoji={onPressEmoji}
          defaultInput={inputText.current}
        />
      )}
      <SendTip
        setModal={setModal}
        modal={modal}
        conversationId={conversationId}
        performerId={performer._id || ""}
      />
      <View style={styles.footerGolive}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.goliveButton}
          onPress={acceptRequest}
        >
          <Text style={styles.btnText}>Start Streaming</Text>
        </TouchableOpacity>
      </View>
      <HeaderMenu />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  footerGolive: {
    flexDirection: "column",
    justifyContent: "space-around",
  },
  goliveButton: {
    backgroundColor: colors.gray,
    borderColor: colors.darkText,
    borderWidth: 2.0,
    borderRadius: Sizes.fixPadding - 5.0,
    justifyContent: "center",
    textAlign: "center",
    width: "100%",
    height: 50.0,
  },
  btnText: {
    color: colors.lightText,
    // alignSelf: 'center',
    textAlign: "center",
    fontWeight: "bold",
  },

  bg1: { backgroundColor: "#1ED760" },
  bg2: { backgroundColor: "#FE294D" },
});

const mapStateToProps = (state) => ({
  currentUser: state.user.current,
  activeConversation: state.streamMessage.activeConversation,
  system: { ...state.system },
  settings: { ...state.system.data },
});

const mapDispatchs = {
  accessPrivateRequest,
  getStreamConversationSuccess,
  resetStreamMessage,
  updateBalance,
};

export default connect(mapStateToProps, mapDispatchs)(PrivateChat);
