import { Alert, Box, HStack, Text, Image } from "native-base";
import { INotification } from "src/interfaces";
import { useSelector, useDispatch } from "react-redux";
import React, { useContext, useEffect, useState } from "react";
import { createSelector } from "reselect";
// import { capitalizeFirstLetter } from "@lib/string";
import moment from "moment";
import { notificationService } from "services/notification.service";
import { useNavigation } from "@react-navigation/core";
import {
  fetchNotificaion,
  setReadItem,
} from "services/redux/notification/actions";
import { TouchableOpacity, View } from "react-native";
import styles from "./style";
import { colors } from "utils/theme";
import { performerService } from "../../services/perfomer.service";

interface IProps {
  notification: any;
}

const SEND_NOTIFICATION = "send_notification";

const NotificationCard = ({ notification }: IProps): React.ReactElement => {
  const [read, setRead] = useState(false);
  const navigation = useNavigation() as any;

  const notifications = useSelector(
    createSelector(
      (state: any) => state.notification.success,
      (state: any) => state.notification.error,
      (state: any) => state.notification.dataSource,
      (success, error, data) => {
        if (success && !error) return data;
        return [];
      }
    )
  ) as INotification[];

  const dispatch = useDispatch();

  const fetchData = () => {
    dispatch(fetchNotificaion());
  };

  const onReceiveNotification = (data) => {
    fetchData();
    Alert(data?.title || data?.message || "You received a new notification");
  };

  useEffect(() => {
    fetchData();
  }, [read]);

  const redirect = async (notification) => {
    const performer = await performerService.findOne(notification.createdBy);
    console.log("nti: ", notification);
    switch (notification.type) {
      case "live":
        return navigation.navigate("ViewPublicStream", {
          performer: performer.data,
        });
      case "follow":
        return navigation.navigate("ModelProfile", {
          performer: performer.data,
        });
      case "comment":
        return;
      case "feed":
        return navigation.navigate("FeedDetail", {
          performerId: notification.createdBy,
          type: "video",
        });
      default:
        return null;
    }
  };

  const onClickItem = (notification) => {
    setRead(true);
    if (!notification?.read) {
      // goi api PUT read
      notificationService.read(notification._id);
      dispatch(setReadItem(notification._id));
    }
    redirect(notification);
  };

  return (
    <Box w="100%" my={1.5}>
      <TouchableOpacity onPress={() => onClickItem(notification)}>
        <HStack
          space={5}
          style={
            notification?.read
              ? styles.notificationRead
              : styles.notificationUnread
          }
        >
          <Box position="relative">
            <Image
              source={
                notification &&
                (notification.thumbnail
                  ? { uri: notification.thumbnail }
                  : require("../../assets/avatar-default.png"))
              }
              alt={"avatar"}
              size={50}
              borderRadius={30}
              resizeMode="cover"
            />
          </Box>

          <View>
            <Text my={3} w={185} fontSize={14} color={colors.lightText}>
              {notification && notification.title}
            </Text>
          </View>

          <Text my={3} color={colors.lightText}>
            {moment(notification.updatedAt).fromNow()}
          </Text>
        </HStack>
      </TouchableOpacity>
    </Box>
  );
};

export default NotificationCard;
