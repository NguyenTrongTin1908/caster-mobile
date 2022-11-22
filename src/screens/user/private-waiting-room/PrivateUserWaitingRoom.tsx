import { Checkbox, Select, Heading, View, Text, Image } from "native-base";
import { TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigation } from "@react-navigation/core";
import { colors, Sizes, Fonts } from "utils/theme";
import styles from "./style";
import HeaderMenu from "components/tab/HeaderMenu";
import { useToast } from "native-base";
import { updateUser, updatePerformer } from "services/redux/user/actions";
import { streamService } from "services/stream.service";
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
  privateRequests: any[];
  updateUser: Function;
  updatePerformer: Function;
  route: any;
}

const PrivateUserWaitingRoom = ({
  error,
  currentUser,
  updatePerformer: handleUpdatePerformer,
  updateUser: handleUpdateUser,
  privateRequests,
  route,
}: IProps) => {
  let authenticate = true;

  let noredirect = true;
  const toast = useToast();

  const [isAvailable, setIsAvailable] = useState(0);
  const [privateChatPrice, setPrivateChatPrice] = useState(0);
  const [openInput, setOpenInput] = useState(false);
  const [isAccept, setIsAccept] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null) as any;
  const [privateRequest, setPrivateRequest] = useState({} as any);

  const { performer } = route.params;
  let privateRequestHolder;

  const navigation = useNavigation() as any;

  useEffect(() => {
    if (currentUser) {
      setIsAvailable(currentUser.privateChat);
      setPrivateChatPrice(privateChatPrice);
    }
  }, []);

  const handleRedirect = () => {
    if (!selectedRequest) {
      toast.show({
        description: "Please select a user to join private chat",
      });
    }
    if (isAvailable) {
      return navigation.navigate("Call", {
        performer: performer,
      });
    }
    return toast.show({
      description: "Please accept all terms & conditions before go live",
    });
  };
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

    if (isAvailable) {
      streamService.requestPrivateChat(performerId).then((res) => {
        privateRequestHolder = res.data;
        setPrivateRequest(res.data);
        const { conversation } = res.data;
        joinPrivateConversation(conversation._id);
        return navigation.navigate("PrivateUserAcceptRoom", {
          performer: performer,
          privateRequest: res.data,
        });
      });
    }
  };

  const handleDeline = () => {
    setIsReset(true);
  };

  const setPrice = () => {
    if (privateChatPrice <= 0) {
      return toast.show({
        description: "The price cannot be set lower than 0",
      });
    }
    handleUpdatePerformer({
      ...currentUser,
      ...{ privateChatPrice },
    });
    // Call the API to set the price
    return toast.show({ description: "Set the price successfully" });
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
            isHideOnClick={false}
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
      </View>
      <View style={styles.privateChatFee}>
        <Text color={colors.lightText}>Room Fee</Text>
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
          onPress={() => requestPrivateCall()}
          disabled={!isAccept}
        >
          <Text style={styles.btnText}>Accept</Text>
        </TouchableOpacity>
        <View style={styles.termBox}>
          <Text style={styles.subText}>Term & Conditions</Text>
          <Checkbox
            value="golive"
            isChecked={isAccept}
            onChange={() => setIsAccept(!isAccept)}
          >
            <Text style={styles.subText}>Accept</Text>
          </Checkbox>
        </View>
      </View>
      <HeaderMenu />
    </SafeAreaView>
  );
};

const mapStates = (state: any) => ({
  ui: { ...state.ui },
  currentUser: { ...state.user.current },
  privateRequests: state.streaming.privateRequests,
});
const mapDispatch = { updateUser, updatePerformer };

export default connect(mapStates, mapDispatch)(PrivateUserWaitingRoom);
