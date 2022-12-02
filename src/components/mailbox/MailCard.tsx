import { Box, HStack, Text, Image, Pressable } from "native-base";
import { IPerformer } from "src/interfaces";
import { useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { IConversation } from "interfaces/message";
import {
  fetchNotificaion,
  setReadItem,
} from "services/redux/notification/actions";
import { TouchableOpacity, View } from "react-native";
import styles from "./style";
import { colors } from "utils/theme";
import OnlineDot from "../uis/OnlineDot";

interface IProps {
  message: IConversation;
  user: IPerformer;
  setActive: Function;
}

const MailCard = ({ message, setActive }: IProps): React.ReactElement => {
  const [read, setRead] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchData();
  }, [read]);

  const fetchData = () => {
    dispatch(fetchNotificaion());
  };

  return (
    <Box w="100%" my={1.5}>
      <TouchableOpacity
        onPress={() => setActive(message?._id, message?.recipientInfo)}
      >
        <HStack
          space={5}
          style={
            !message?.totalNotSeenMessages
              ? styles.notificationRead
              : styles.notificationUnread
          }
        >
          <Box position="relative" flexDirection={"column"}>
            <Image
              source={
                message &&
                (message?.recipientInfo?.avatar
                  ? { uri: message?.recipientInfo?.avatar }
                  : require("../../assets/avatar-default.png"))
              }
              alt={"avatar"}
              size={50}
              borderRadius={30}
              resizeMode="cover"
            />
            {message?.recipientInfo?.isOnline ? (
              <OnlineDot right={0} top={2} />
            ) : null}
            <Text color={colors.active} alignSelf="center" fontWeight={"bold"}>
              {message?.recipientInfo?.name || message?.recipientInfo?.username}
            </Text>
          </Box>
          <View>
            <Text
              my={3}
              w={180}
              maxW={200}
              fontSize={14}
              color={colors.lightText}
            >
              {message && message?.lastMessage}
            </Text>
          </View>
          <View>
            {message && message?.totalNotSeenMessages ? (
              <View style={styles.activeNowTick}>
                <Text color={colors.lightText}>
                  {message?.totalNotSeenMessages}
                </Text>
              </View>
            ) : null}
            <Text my={3} color={colors.lightText}>
              {moment(message?.updatedAt).fromNow()}
            </Text>
          </View>
        </HStack>
      </TouchableOpacity>
    </Box>
  );
};

export default MailCard;
