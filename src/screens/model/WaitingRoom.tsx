import Notification from "./component/Notification";
import { Box, Heading } from "native-base";
import React, { PureComponent } from "react";
import { SafeAreaView, Touchable, TouchableOpacity, View } from "react-native";
import HeaderMenu from "components/tab/HeaderMenu";
import styles from "./style";
import { colors, Sizes } from "utils/theme";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/core";
import TabView from "components/uis/TabView";
import Mail from "./waitingRoom";

const WaitingRoom = (): React.ReactElement => {
  const navigation = useNavigation() as any;
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1} mx="auto" w="100%">
        <HeaderMenu />
        <Heading
          mb={4}
          fontSize={34}
          textAlign="center"
          color={colors.lightText}
          bold
        >
          Notification
        </Heading>
        <View style={styles.iconSettings}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.navigate("PushNotificationSetting")}
          >
            <Ionicons
              name="settings"
              color={colors.lightText}
              size={28}
            ></Ionicons>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, marginTop: -15 }}>
          <TabView
            scenes={[
              {
                key: "Notification",
                title: "Notifications",
                sence: Notification,
              },
              {
                key: "Mailbox",
                title: "Mailbox",
                sence: Mail,
              },
            ]}
          />
        </View>
      </Box>
    </SafeAreaView>
  );
};

export default WaitingRoom;
