import { Checkbox, Select, Heading, View, Text, Image } from "native-base";
import { TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigation } from "@react-navigation/core";
import { colors } from "utils/theme";
import styles from "./style";
import { useToast } from "native-base";
import { updateUser, updatePerformer } from "services/redux/user/actions";
import { streamService } from "services/stream.service";
import socketHolder from "lib/socketHolder";
import { getStreamConversationSuccess } from "services/redux/stream-chat/actions";
import { IPerformer } from "src/interfaces";
import { SafeAreaView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import ButtonFollow from "components/uis/ButtonFollow";
import BackButton from "components/uis/BackButton";
import HeaderMenu from "components/tab/HeaderMenu";
import { ROLE_PERMISSIONS } from "../../../constants";

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
  privateRequests: any[];
  updateUser: Function;
  updatePerformer: Function;
  route: any;
  getStreamConversationSuccess: Function;
}

const PrivateUserWaitingRoom = ({
  error,
  currentUser,
  updatePerformer: handleUpdatePerformer,
  updateUser: handleUpdateUser,
  route,
  getStreamConversationSuccess: dispatchGetStreamConversationSuccess,
}: IProps) => {
  const toast = useToast();
  const [isAvailable, setIsAvailable] = useState(0);
  const [privateChatPrice, setPrivateChatPrice] = useState(0);
  const [isAccept, setIsAccept] = useState(false);
  const { performer } = route.params;
  const navigation = useNavigation() as any;

  useEffect(() => {
    if (performer) {
      setIsAvailable(performer.privateChat);
      setPrivateChatPrice(privateChatPrice);
    }
  }, []);

  const joinPrivateConversation = (conversationId) => {
    const socket = socketHolder.getSocket() as any;
    // emit this event to receive info of JOINED_THE_ROOM below
    socket.emit(EVENT.JOIN_ROOM, {
      conversationId,
    });
  };

  const requestPrivateCall = async () => {
    if (!performer) return;
    const { _id: performerId } = performer as any;
    try {
      if (!currentUser.roles.includes(ROLE_PERMISSIONS.ROLE_FAN_PAYING)) {
        toast.show({
          description:
            "You dont have permission to send request. Please have a first ruby purchase",
        });
        navigation.navigate("TokenPackage");
        return false;
      }
      if (currentUser.rubyBalance < performer.privateChatPrice * 5) {
        toast.show({
          description: "You have an insufficient ruby balance. Please top up.",
        });
        navigation.navigate("TokenPackage");
        return false;
      }
      if (isAvailable) {
        streamService
          .requestPrivateChat(performerId)
          .then((res) => {
            const { conversation } = res.data;
            joinPrivateConversation(conversation._id);
            dispatchGetStreamConversationSuccess({
              data: conversation,
            });
            return navigation.navigate("PrivateUserAcceptRoom", {
              performer: performer,
              privateRequest: res.data,
            });
          })
          .catch(async (e: any) => {
            const error = await e;
            toast.show({ description: error.message });
          });
      }
    } catch (e: any) {}
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
        Waiting Room
      </Heading>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            minHeight: 45,
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
          {performer && performer?.name
            ? `${performer?.name}`
            : `${performer?.username}`}
        </Text>
        <View style={styles.privateTextLicense}>
          <Text color={colors.lightText}>
            {performer?.name || performer?.username} is available NOW for:{"\n"}
            • Virtual Date - A great way to have a 1 on 1 video date with your
            favorite model. Get to know each other while spending far less than
            you would on transportation, dinner and drinks.{"\n"}• Virtual
            Performance A private ticket to a personalized live performance of
            amazing talent in the comfort and safety of home. How would you like
            to communicate back?
          </Text>
        </View>
        <Text color={colors.lightText}>
          This private Room Fee will be automatically deducted from your account
          at the beginning of each minute.
        </Text>
        <View style={styles.privateChatFee}>
          <Text color={colors.lightText}>Room Fee</Text>
          <View style={styles.privateChatPrice}>
            <Text color={colors.lightText}>{currentUser.privateChatPrice}</Text>
            <Ionicons name="heart" color={colors.ruby} size={25}></Ionicons>
            <Text color={colors.lightText}> / per minute</Text>
          </View>
          <Text color={colors.lightText}>5 Minute Min</Text>
        </View>
        <View style={styles.footerGolive}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.goliveButton, { opacity: isAccept ? 1 : 0.5 }]}
            onPress={() => requestPrivateCall()}
            disabled={!isAccept}
          >
            <Text style={styles.btnText}>Accept</Text>
          </TouchableOpacity>
          <View style={styles.termBox}>
            <Text style={styles.subText}>Term & Conditions</Text>
            <Checkbox
              value="acceptWaitingRoom"
              isChecked={isAccept}
              onChange={() => setIsAccept(!isAccept)}
            >
              <Text style={styles.subText}>Accept</Text>
            </Checkbox>
          </View>
        </View>
      </View>

      <HeaderMenu />
      <BackButton />
    </SafeAreaView>
  );
};

const mapStates = (state: any) => ({
  ui: { ...state.ui },
  currentUser: { ...state.user.current },
  privateRequests: state.streaming.privateRequests,
});
const mapDispatch = {
  updateUser,
  updatePerformer,
  getStreamConversationSuccess,
};

export default connect(mapStates, mapDispatch)(PrivateUserWaitingRoom);
