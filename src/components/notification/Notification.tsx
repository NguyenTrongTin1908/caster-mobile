// import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import React, { CSSProperties, useEffect } from "react";
import {
  fetchNotificaion,
  addNotificaion,
} from "services/redux/notification/actions";
import { createSelector } from "reselect";
import NotificationList from "./NotificationList";

interface NotificationProps {
  style?: CSSProperties;
}

const Notification = (notificationProps: NotificationProps) => {
  const dispatch = useDispatch();

  const loadMore = () => {
    dispatch(addNotificaion());
  };

  const fetchData = () => {
    dispatch(fetchNotificaion());
  };

  useEffect(() => {
    fetchData();
  }, []);
  const notificationIds = useSelector(
    createSelector(
      (state: any) => state.notification?.success,
      (state: any) => state.notification?.error,
      (state: any) => state.notification?.notificationIds,
      (success, error, data) => {
        if (success && !error) return data;
        return [];
      }
    )
  );

  const canloadmore = useSelector(
    createSelector(
      (state: any) => state.notification?.loading,
      (state: any) => state.notification?.total,
      (state: any) => state.notification?.notificationIds,
      (loading, total, data) => {
        if (loading || data?.length >= total) return false;
        return true;
      }
    )
  );

  return <NotificationList></NotificationList>;
};

export default Notification;
