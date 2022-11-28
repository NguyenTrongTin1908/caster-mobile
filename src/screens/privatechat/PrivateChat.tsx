import React, { useEffect, useRef, useState } from "react";
import { PermissionsAndroid, SafeAreaView, StyleSheet } from "react-native";
import {
  PERMISSIONS,
  requestMultiple,
  RESULTS,
} from "react-native-permissions";
import { Text, View, Heading, HStack, useToast } from "native-base";
import Button from "components/uis/Button";
import { tokenService } from "services/token.service";
import socketHolder from "lib/socketHolder";
import { Private } from "components/antmedia/Private";
import { Viewer } from "components/antmedia/Viewer";
import { WEBRTC } from "../../interfaces";
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
import { updateBalance } from "services/redux/user/actions";
import {
  getStreamConversationSuccess,
  resetStreamMessage,
} from "services/redux/stream-chat/actions";
import ChatBox from "components/streamChat/chat-box";

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
  activeConversation: any;
}

let privateRequestHolder;
let chargerTimeout;

const PrivateChat = ({
  route,
  settings,
  accessPrivateRequest: access,
  getStreamConversationSuccess: dispatchGetStreamConversationSuccess,
  resetStreamMessage,
  updateBalance,
  currentUser,
  activeConversation,
}: IProps) => {
  const navigation = useNavigation() as any;
  let subscrbierRef: any;
  let subscriberRef2: any;
  const { selectedRequest } = route.params;
  const [roomJoined, setRoomJoined] = useState(false);
  const [modal, setModal] = useState(false);
  const [callTime, setCallTime] = useState(0);
  const [receivedToken, setReceivedToken] = useState(0);
  const [total, setTotal] = useState(0);
  const [members, setMembers] = useState([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const inputText = useRef("");
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [privateRequest, setPrivateRequest] = useState({} as any);
  const localStreamRef = useRef({ id: "" }).current;
  const remoteStreamRef = useRef({
    id: "",
  }).current;
  const toast = useToast();

  useEffect(() => {
    askPermissions();
    handleSocketsJoin();
    access(selectedRequest.conversationId);
    const socket = socketHolder.getSocket() as any;
    socket.on("public-room-changed", handler);
    return () => {
      privateRequestHolder = null;
      chargerTimeout && clearTimeout(chargerTimeout);
      handleSocketLeave();
    };
  }, []);

  const handleSocketsJoin = async () => {
    const socket = socketHolder.getSocket() as any;
    if (!socket) return;
    socket.on(EVENT.JOINED_THE_ROOM, ({ streamId, conversationId }) => {
      if (!localStreamRef.id) {
        socket.emit("private-stream/join", {
          conversationId,
          streamId,
        });
        console.log("Voooooo");
        localStreamRef.id = streamId;
        // setLocalStreamId(streamId);
      } else {
        remoteStreamRef.id = streamId;
      }
    });

    socket.on("private-stream/streamJoined", ({ conversationId, streamId }) => {
      if (localStreamRef.id !== streamId) {
        const cId = selectedRequest?.conversationId;

        if (cId === conversationId) {
          remoteStreamRef.id = streamId;
          // setRemoteStreamId(streamId);
        }
      }
    });
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
      // TODO - check me here
    }
  };

  const hangUp = async () => {
    // TODO - send socket event to stop, wait for local stream stop then navigate
    privateRequestHolder = null;
    chargerTimeout && (await clearTimeout(chargerTimeout));
    await handleSocketLeave();
    remoteStreamRef.id = "";
    localStreamRef.id = "";

    toast.show({
      description: "Private call has ended",
    });
    navigation.navigate("LiveNow", {});
  };

  const acceptRequest = async () => {
    if (!selectedRequest.conversationId) return;
    const socket = socketHolder.getSocket() as any;
    try {
      const resp = await streamService.acceptPrivateChat(
        selectedRequest.conversationId
      );
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
        setInitialized(true);
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

  const handler = ({ total, members }) => {
    setTotal(total);
    setMembers(members);
  };

  const renderLocalVideo = () => {
    if (!localStreamRef.id) return null;

    if (isAndroid()) {
      return <Private streamId={localStreamRef.id} />;
    }

    return <PublisherIOS streamId={localStreamRef.id} />;
  };

  const renderPerformerVideo = () => {
    const { optionForBroadcast } = settings;
    if (!remoteStreamRef.id) return null;
    return optionForBroadcast === WEBRTC
      ? !!remoteStreamRef.id && <Viewer streamId={remoteStreamRef.id} />
      : !!remoteStreamRef.id && (
          <HLSViewer
            streamId={remoteStreamRef.id}
            ref={(viewRef) => setStreamRef(viewRef)}
            settings={settings}
          />
        );
  };
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
        {renderLocalVideo()}

        {renderPerformerVideo()}
        {<ChatBox canSendMessage canSendTip={false} />}
      </View>

      <View style={styles.footerGolive}>
        {!initialized ? (
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.goliveButton}
            onPress={acceptRequest}
          >
            <Text style={styles.btnText}>Start Streaming</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.goliveButton}
            onPress={hangUp}
          >
            <Text style={styles.btnText}>Stop Streaming</Text>
          </TouchableOpacity>
        )}
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
