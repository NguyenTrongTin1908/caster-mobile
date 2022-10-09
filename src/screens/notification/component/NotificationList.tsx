import { Alert } from "native-base";
import { INotification } from "src/interfaces";
import { useSelector, useDispatch } from "react-redux";
import React, { useContext, useEffect, useState } from "react";
import { createSelector } from "reselect";
// import { capitalizeFirstLetter } from "@lib/string";
import moment from "moment";
import { fetchNotificaion } from "services/redux/notification/actions";
import { useNavigation } from "@react-navigation/core";
import { SocketContext } from "../../../socket";
import { FlatList, SafeAreaView, View } from "react-native";
import styles from "../style";
import BadgeText from "components/uis/BadgeText";
import NotificationCard from "./NotificationCard";

const SEND_NOTIFICATION = "send_notification";

const NotificationList = () => {
  const socket = useContext(SocketContext);
  const [read, setRead] = useState(false);

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

  const canloadmore = useSelector(
    createSelector(
      (state: any) => state.notification.loading,
      (state: any) => state.notification.total,
      (state: any) => state.notification.notificationIds,
      (loading, total, data) => {
        if (loading || data.length >= total) return false;
        return true;
      }
    )
  );

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

  useEffect(() => {
    if (socket) {
      socket.on(SEND_NOTIFICATION, onReceiveNotification);
    }
    return () => {
      socket.off(SEND_NOTIFICATION, onReceiveNotification);
    };
  }, [socket]);

  // const renderEmpty = () => (
  //   <View>
  //     {!loading && !notifications.length && (
  //       <BadgeText content={"There is no performer available!"} />
  //     )}
  //   </View>
  // );

  return (
    <FlatList
      data={notifications}
      renderItem={({ item }) => (
        <NotificationCard key={item._id} notification={item} />
      )}
      keyExtractor={(item, index) => item._id + "_" + index}
      style={styles.listModel}
      onEndReachedThreshold={0.5}
      onEndReached={() => fetchData()}
    />
  );
};

export default NotificationList;
