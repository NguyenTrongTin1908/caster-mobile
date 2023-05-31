import React, { useEffect, useRef, useState } from "react";
import { PermissionsAndroid, SafeAreaView } from "react-native";
import {
  PERMISSIONS,
  requestMultiple,
  RESULTS,
} from "react-native-permissions";
import { Text, View, Heading, useToast, Button, Image } from "native-base";
import { tokenService } from "services/token.service";
import socketHolder from "lib/socketHolder";
import { Private } from "components/antmedia/Private";
import { Viewer } from "components/antmedia/Viewer";
import { WEBRTC, IPerformer } from "../../interfaces";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/core";
import { isAndroid } from "utils/common";
import PublisherIOS from "components/antmedia/PublisherIOS";
import { connect } from "react-redux";
import { HLSViewer } from "components/antmedia/HLSViewer";
import HeaderMenu from "components/tab/HeaderMenu";
import { colors } from "utils/theme";
import ChatBox from "components/streamChat/chat-box";
import FavoriteGift from "components/gift/favorite";
import SendTip from "components/message/SendTip";
import { giftService } from "../../services";
import AntDesign from "react-native-vector-icons/AntDesign";
import styles from "./styles";
import { WEBRTC_ADAPTOR_INFORMATIONS } from "components/antmedia/constants";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { shortenLargeNumber } from "lib/number";
import { ObservableQueue } from "../../hooks/observable-queue";
import { of, delay, Subscription } from "rxjs";
const queue = new ObservableQueue();

enum EVENT {
  JOINED_THE_ROOM = "JOINED_THE_ROOM",
  JOIN_ROOM = "JOIN_ROOM",
  LEAVE_ROOM = "LEAVE_ROOM",
  STREAM_INFORMATION_CHANGED = "private-stream/streamInformationChanged",
  MODEL_JOIN_ROOM = "MODEL_JOIN_ROOM",
  SEND_PAID_TOKEN = "SEND_PAID_TOKEN",
  RECEIVED_PAID_TOKEN_EVENT = "RECEIVED_PAID_TOKEN_EVENT",
}
interface IProps {
  localStreamId: any;
  route: any;
  settings: any;
  remoteStreamId: any;
  currentUser: IPerformer;
  activeConversation: any;
}

let privateRequestHolder;
let chargerTimeout;

const Call = ({ route, settings, currentUser, activeConversation }: IProps) => {
  const navigation = useNavigation() as any;
  let subscriberRef2: any;
  const { localStreamId, remoteStreamId, privateRequest } = route.params;
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [localStreamRefId, setLocalStreamRefId] = useState(localStreamId);
  const [remoteStreamRefId, setRemoteStreamRefId] = useState(remoteStreamId);
  const [favoriteGift, setFavoriteGift] = useState({} as any);
  const [modal, setModal] = useState(false);
  const toast = useToast();
  const [isMuteAudio, setMuteAudio] = useState(false);
  const [imgUrl, setImgUrl] = useState(null) as any;
  const living = useRef() as any;

  useEffect(() => {
    askPermissions();
    getfavoriteGift();
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
        streamId: localStreamRefId,
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
    setLocalStreamRefId(null);
    setRemoteStreamRefId(null);
    toast.show({
      description: "Private call has ended",
    });
    navigation.navigate("LiveNow", {});
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
      console.log("charge error", e);
      // hangUp();
    }
  };

  const callback = (info: WEBRTC_ADAPTOR_INFORMATIONS) => {
    if (activeConversation && activeConversation.data) {
      // const socket = this.context;
      const socket = socketHolder.getSocket() as any;
      if (info === WEBRTC_ADAPTOR_INFORMATIONS.INITIALIZED) {
        setInitialized(true);
        console.log("INITIALIZED");
        // if (publisherRef.publish) publisherRef.publish(sessionId);
        // else publisherRef2.publish(sessionId);
      } else if (info === WEBRTC_ADAPTOR_INFORMATIONS.PUBLISH_STARTED) {
        const conversation = { ...activeConversation.data };
        living.current = true;
        socket.on(
          `message_created_conversation_${conversation._id}`,
          (data) => {
            onReceiveGift(data, "created");
          }
        );

        console.log("public");

        setLoading(true);
      } else if (info === WEBRTC_ADAPTOR_INFORMATIONS.PUBLISH_FINISHED) {
        console.log("finished");

        setLoading(false);
      } else if (info === WEBRTC_ADAPTOR_INFORMATIONS.CLOSED) {
        setLoading(false);
        console.log("close");
        setInitialized(false);
      }
    }
  };

  const renderLocalVideo = () => {
    if (!localStreamRefId) return null;
    if (isAndroid()) {
      return (
        <Private
          isMuteAudio={isMuteAudio}
          streamId={localStreamRefId}
          onChange={callback}
        />
      );
    }

    return <PublisherIOS streamId={localStreamRefId} onChange={callback} />;
  };

  const getfavoriteGift = async () => {
    setLoading(false);
    const respGift = await (await giftService.favoriteGift()).data;
    setFavoriteGift(respGift.data[0]);
    setLoading(true);
  };

  const favoriteHandle = async (gift) => {
    try {
      if (gift && gift.length > 0) {
        setFavoriteGift(gift[0]);
        await giftService.addfavoriteGift({ giftId: gift[0]._id });
      }
    } catch (error) {
      console.log("Error : ", error);
    }
  };

  const renderPerformerVideo = () => {
    const { optionForBroadcast } = settings;
    if (!remoteStreamRefId) return null;
    return optionForBroadcast === WEBRTC
      ? !!remoteStreamRefId && (
          <Viewer streamId={remoteStreamRefId} onJoined={chargeInterval} />
        )
      : !!remoteStreamRefId && (
        <>
          <HLSViewer
            streamId={remoteStreamRefId}
            ref={(viewRef) => setStreamRef(viewRef)}
            settings={settings}
            onJoined={chargeInterval}
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
          </>
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
      <View style={styles.rightBarStream}>
        <FavoriteGift
          performerId={privateRequest?.conversation?.performerId}
          conversationId={activeConversation?.data?._id}
          favorGift={favoriteGift}
        />
        <TouchableOpacity onPress={() => setModal(true)}>
          <AntDesign
            style={styles.iconStream}
            name="gift"
            color={colors.light}
            size={28}
          />
        </TouchableOpacity>
      </View>
      <View flex={1} flexDirection={"column"} position={"relative"}>
        {renderLocalVideo()}
        {renderPerformerVideo()}

        <ChatBox canSendMessage />
        {loading && (
          <SendTip
            setModal={setModal}
            aria-label="Send Tip"
            modal={modal}
            conversationId={privateRequest?.conversation?._id}
            performerId={privateRequest?.conversation?.performerId || ""}
            saveFavorite={favoriteHandle}
            favorGift={favoriteGift}
          />
        )}
      </View>
      <View style={styles.footerGolive}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.goliveButton}
          onPress={hangUp}
        >
          <Text style={styles.btnText}>Stop Streaming</Text>
        </TouchableOpacity>
      </View>
      <HeaderMenu />
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.user.current,
  activeConversation: state.streamMessage.activeConversation,
  system: { ...state.system },
  settings: { ...state.system.data },
});
const mapDispatch = {};

export default connect(mapStateToProps, mapDispatch)(Call);
