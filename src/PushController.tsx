import React, { useEffect } from "react";
import PushNotification, { Importance } from "react-native-push-notification";
import { connect } from "react-redux";
import { setFCMToken } from "./services/redux/auth/actions";
import { navigationRef } from "./navigations/RootStackNavigator";
import { performerService } from "services/perfomer.service";

interface IProps {
  setFCMToken: Function;
}
const PushController = ({ setFCMToken }: IProps): React.ReactElement => {
  useEffect(() => {
    PushNotification.configure({
      onRegister: async function (token) {
        setFCMToken(token);
      },
      onNotification: async (notification) => {
        const performer = await performerService.findOne(
          notification.data.createdBy
        );

        switch (notification.data.type) {
          case "live":
            return navigationRef.current?.navigate("ViewPublicStream", {
              performer: performer.data,
            });
          case "follow":
            return navigationRef.current?.navigate("ModelProfile", {
              performer: performer.data,
            });
          case "comment":
            return;
          case "feed":
            return navigationRef.current?.navigate("FeedDetail", {
              performerId: notification.data.createdBy,
              type: "video",
            });
          default:
            return null;
        }
      },
      // Android only
      senderID: "920781714888",
      // iOS only
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
    createDefaultChannels();
  }, []);

  const createDefaultChannels = () => {
    PushNotification.createChannel(
      {
        channelId: "default-channel-id", // (required)
        channelName: "Default channel", // (required)
        channelDescription: "A default channel", // (optional) default: undefined.
        soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
      },
      (created) =>
        console.log(`createChannel 'default-channel-id' returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
    PushNotification.createChannel(
      {
        channelId: "sound-channel-id", // (required)
        channelName: "Sound channel", // (required)
        channelDescription: "A sound channel", // (optional) default: undefined.
        soundName: "funny_notification.mp3", // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
      },
      (created) =>
        console.log(`createChannel 'sound-channel-id' returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
  };

  return <></>;
};
const mapDispatch = {
  setFCMToken,
};

export default connect(null, mapDispatch)(PushController);
