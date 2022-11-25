import { Select, Heading, View, Text, Image } from "native-base";
import { TouchableOpacity } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { useNavigation } from "@react-navigation/core";
import { colors, Sizes, Fonts } from "utils/theme";
import styles from "./style";
import HeaderMenu from "components/tab/HeaderMenu";
import { useToast } from "native-base";
import { updateUser, updatePerformer } from "services/redux/user/actions";
import socketHolder from "lib/socketHolder";
import { IPerformer } from "src/interfaces";
import { SafeAreaView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import ButtonFollow from "components/uis/ButtonFollow";

const Option = Select;
enum EVENT {
  JOINED_THE_ROOM = "JOINED_THE_ROOM",
  JOIN_ROOM = "JOIN_ROOM",
  LEAVE_ROOM = "LEAVE_ROOM",
  STREAM_INFORMATION_CHANGED = "private-stream/streamInformationChanged",
  MODEL_JOIN_ROOM = "MODEL_JOIN_ROOM",
  SEND_PAID_TOKEN = "SEND_PAID_TOKEN",
}

interface IProps {
  error: any;
  currentUser: IPerformer;
  updateUser: Function;
  updatePerformer: Function;
  route: any;
}

const PrivateUserAcceptRoom = ({
  error,
  currentUser,
  updatePerformer: handleUpdatePerformer,
  updateUser: handleUpdateUser,
  route,
}: IProps) => {
  const navigation = useNavigation() as any;

  const [privateChatPrice, setPrivateChatPrice] = useState(0);
  const [isAccept, setIsAccept] = useState(false);
  const localStreamRef = useRef({ id: "" }).current;
  const [localStreamId, setLocalStreamId] = useState(null as any);
  const remoteStreamRef = useRef({
    id: "",
  }).current;
  const [remoteStreamId, setRemoteStreamId] = useState("");

  const { performer, privateRequest } = route.params;
  let privateRequestHolder;

  useEffect(() => {
    if (currentUser) {
      setPrivateChatPrice(privateChatPrice);
    }
    handleSocketsJoin();
  }, []);

  useEffect(() => {
    if (remoteStreamId) {
      navigation.navigate("Call", {
        localStreamId,
        remoteStreamId,
        privateRequest,
      });
    }
  }, [remoteStreamId]);

  const handleSocketsJoin = async () => {
    const socket = socketHolder.getSocket() as any;
    if (!socket) return;
    socket.on(EVENT.JOINED_THE_ROOM, ({ streamId, conversationId }) => {
      if (!localStreamRef.id) {
        socket.emit("private-stream/join", {
          conversationId,
          streamId,
        });
        localStreamRef.id = streamId;
        setLocalStreamId(streamId);
      } else {
        remoteStreamRef.id = streamId;
      }
    });

    socket.on("private-stream/streamJoined", ({ conversationId, streamId }) => {
      if (localStreamRef.id !== streamId) {
        const cId =
          privateRequest?.conversation?._id ||
          privateRequestHolder?.conversation?._id;

        if (cId === conversationId) {
          remoteStreamRef.id = streamId;
          setRemoteStreamId(streamId);
        }
      }
    });
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
        Private Waiting Room
      </Heading>

      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <ButtonFollow
            isHideOnClick
            targetId={performer._id}
            sourceId={currentUser._id}
            isFollow={performer.isFollowed}
            getPerformerList={() => {}}
          />
        </View>
        <View style={styles.avContainer}>
          <View style={styles.avBlueRound}>
            <Image
              source={
                performer?.avatar
                  ? { uri: performer?.avatar }
                  : require("../../../assets/avatar-default.png")
              }
              alt={"avatar"}
              size={100}
              borderRadius={80}
              resizeMode="cover"
            />
            {performer?.isOnline ? (
              <View style={styles.activeNowTick}></View>
            ) : null}
          </View>
        </View>
        <Text style={styles.textName}>
          {performer && performer?.name != " "
            ? `${performer?.name}`
            : `${performer?.username}`}
        </Text>
      </View>
      <View style={styles.privateTextLicense}>
        <Text color={colors.lightText}>
          The Auto Tip for this private video chat room will be automatically
          deducted from your account at the beginning of each minute.
        </Text>
      </View>
      <View style={styles.privateChatFee}>
        <Text color={colors.lightText}>Auto Tip</Text>
        <View style={styles.privateChatPrice}>
          <Text color={colors.lightText}>{currentUser.privateChat}</Text>
          <Ionicons name="heart" color={colors.ruby} size={25}></Ionicons>
          <Text color={colors.lightText}> / per minute</Text>
        </View>
        <Text color={colors.lightText}>5 Minute Min</Text>
      </View>
      <View style={styles.footerGolive}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.goliveButton}
          disabled={!isAccept}
        >
          <Text style={styles.btnText}>Cancel</Text>
        </TouchableOpacity>
      </View>
      <HeaderMenu />
    </SafeAreaView>
  );
};

const mapStates = (state: any) => ({
  ui: { ...state.ui },
  currentUser: { ...state.user.current },
});
const mapDispatch = { updateUser, updatePerformer };

export default connect(mapStates, mapDispatch)(PrivateUserAcceptRoom);
