import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import React from "react";
import Home from "screens/browse/Home";
import CaptureMediaScreen from "screens/media/CaptureMedia";
import Top from "screens/top/Top";
import LiveNow from "screens/livenow/LiveNow";
import Discover from "screens/Discover/Discover";
import { colors } from "utils/theme";
import { Platform, StyleSheet } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import IntroNav from "./IntroNav";
import ChatRoom from "screens/chat/ChatRoom";
import PrivateChatDetail from "screens/chat/PrivateChatDetail";
import PerformerDetail from "screens/performer/PerformerDetail";
import Call from "screens/call/Call";
import Calling from "screens/call/Calling";
import FeedDetail from "screens/detail/feedDetail";
import MediaPreview from "screens/media/MediaPreview";
import Upload from "screens/feed/Upload";
import Hashtag from "screens/hashtag/Hashtag";
import ListFollow from "screens/follow/listFollow";
import Trending from "screens/trending/Trending";
import FollowPost from "screens/followPost/FollowPost";
import ModelProfile from "screens/model/profile/ModelProfile";
import Bookmarks from "screens/model/bookmarks/Bookmarks";
import Profile from "screens/profile/Profile";
import PushNotificationSetting from "screens/notification-setting/PushNotificationSetting";
import NotificationPage from "screens/notification/Notification";
import Wallet from "screens/wallet/Wallet";
import TokenPackage from "screens/token-package/TokenPackage";
import ModelOrderPage from "screens/model/my-order";
import OrderDetailPage from "screens/model/my-order/detail";
import PublicStream from "screens/live/PublicStream";
import ViewPublicStream from "screens/live/ViewPublicStream";
import GoLivePage from "screens/model/waitingRoom/PublicWaitingRoom";
import PrivateChatWaitingRoom from "screens/model/waitingRoom/PrivateWaitingRoom";
import PrivateUserWaitingRoom from "screens/user/private-waiting-room/PrivateUserWaitingRoom";
import PrivateUserAcceptRoom from "screens/user/private-accept-room/PrivateUserAccept";
import PrivateChat from "screens/privatechat/PrivateChat";
import Blank from "screens/blank";
import EditProfile from "screens/profile/EditProfile";
import Help from "screens/help/Help";
import Detail from "screens/help/Detail";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
const SettingsStack = createNativeStackNavigator();

const Screen = (): JSX.Element => (
  <>
    <SettingsStack.Screen
      options={{
        headerShown: false,
        gestureEnabled: false,
      }}
      name="ChatRoom"
      component={ChatRoom}
    />
    <SettingsStack.Screen
      options={{
        headerShown: false,
        gestureEnabled: false,
      }}
      name="ListFollow"
      component={ListFollow}
    />
    <SettingsStack.Screen
      options={{
        headerShown: false,
        gestureEnabled: false,
      }}
      name="PushNotificationSetting"
      component={PushNotificationSetting}
    />
    <SettingsStack.Screen
      options={{
        headerShown: false,
        gestureEnabled: false,
      }}
      name="FollowPost"
      component={FollowPost}
    />
    <SettingsStack.Screen
      options={{ headerShown: false, gestureEnabled: false }}
      name="Trending"
      component={Trending}
    />
    <SettingsStack.Screen
      options={{
        headerShown: false,
        gestureEnabled: false,
      }}
      name="PrivateChatDetail"
      component={PrivateChatDetail}
    />
    <SettingsStack.Screen
      options={{
        headerShown: false,
        gestureEnabled: false,
      }}
      name="OrderDetailPage"
      component={OrderDetailPage}
    />
    <SettingsStack.Screen
      options={{ headerShown: false, gestureEnabled: false }}
      name="PerformerDetail"
      component={PerformerDetail}
    />
    <SettingsStack.Screen
      options={{ headerShown: false, gestureEnabled: false }}
      name="NotificationPage"
      component={NotificationPage}
    />
    <SettingsStack.Screen
      options={{ headerShown: false, gestureEnabled: false }}
      name="Profile"
      component={Profile}
    />
    <SettingsStack.Screen
      options={{ headerShown: false, gestureEnabled: false }}
      name="Wallet"
      component={Wallet}
    />
    <SettingsStack.Screen
      options={{ headerShown: false, gestureEnabled: false }}
      name="Help"
      component={Help}
    />
    <SettingsStack.Screen
      options={{ headerShown: false, gestureEnabled: false }}
      name="Detail"
      component={Detail}
    />
    <SettingsStack.Screen
      options={{ headerShown: false, gestureEnabled: false }}
      name="TokenPackage"
      component={TokenPackage}
    />
    <SettingsStack.Screen
      options={{ headerShown: false, gestureEnabled: false }}
      name="Bookmarks"
      component={Bookmarks}
    />
    <SettingsStack.Screen
      options={{ headerShown: false, gestureEnabled: false }}
      name="ModelOrderPage"
      component={ModelOrderPage}
    />
    <SettingsStack.Screen
      options={{ headerShown: false, gestureEnabled: false }}
      name="MediaPreview"
      component={MediaPreview}
    />
    <SettingsStack.Screen
      options={{ headerShown: false, gestureEnabled: false }}
      name="Upload"
      component={Upload}
    />
    <SettingsStack.Screen
      options={{ headerShown: false, gestureEnabled: false }}
      name="FeedDetail"
      component={FeedDetail}
    />
    <SettingsStack.Screen
      options={{ headerShown: false, gestureEnabled: false }}
      name="ModelProfile"
      component={ModelProfile}
    />
    <SettingsStack.Screen
      options={{ headerShown: false, gestureEnabled: false }}
      name="EditProfile"
      component={EditProfile}
    />
    <SettingsStack.Screen
      options={{ headerShown: false, gestureEnabled: false }}
      name="Hashtag"
      component={Hashtag}
    />
    <SettingsStack.Screen
      options={{ headerShown: false }}
      name="Blank"
      component={Blank}
    />
    <SettingsStack.Screen
      options={{ headerShown: false }}
      name="Call"
      component={Call}
    />
    <SettingsStack.Screen
      options={{ headerShown: false }}
      name="Calling"
      component={Calling}
    />
    <SettingsStack.Screen
      options={{ headerShown: false }}
      name="PublicStream"
      component={PublicStream}
    />
    <SettingsStack.Screen
      options={{ headerShown: false }}
      name="ViewPublicStream"
      component={ViewPublicStream}
    />
    <SettingsStack.Screen
      options={{ headerShown: false }}
      name="GoLivePage"
      component={GoLivePage}
    />
    <SettingsStack.Screen
      options={{ headerShown: false }}
      name="PrivateChatWaitingRoom"
      component={PrivateChatWaitingRoom}
    />
    <SettingsStack.Screen
      options={{ headerShown: false }}
      name="PrivateUserWaitingRoom"
      component={PrivateUserWaitingRoom}
    />
    <SettingsStack.Screen
      options={{ headerShown: false }}
      name="PrivateUserAcceptRoom"
      component={PrivateUserAcceptRoom}
    />
    <SettingsStack.Screen
      options={{ headerShown: false }}
      name="PrivateChat"
      component={PrivateChat}
    />
    <SettingsStack.Screen
      options={{ headerShown: false }}
      name="IntroNav"
      component={IntroNav}
    />
  </>
);

function HomeStackScreen() {
  return (
    <SettingsStack.Navigator initialRouteName={"Home"}>
      <SettingsStack.Screen
        options={{ headerShown: false, gestureEnabled: false }}
        name={"Home"}
        component={Home}
      />
      {Screen()}
    </SettingsStack.Navigator>
  );
}

function LiveNowStackScreen() {
  return (
    <SettingsStack.Navigator initialRouteName={"LiveNow"}>
      <SettingsStack.Screen
        options={{ headerShown: false, gestureEnabled: false }}
        name={"LiveNow"}
        component={LiveNow}
      />
      {Screen()}
    </SettingsStack.Navigator>
  );
}

function CaptureMediaScreenStackScreen() {
  return (
    <SettingsStack.Navigator initialRouteName={"PostVideo"}>
      <SettingsStack.Screen
        options={{ headerShown: false, gestureEnabled: false }}
        name={"PostVideo"}
        component={CaptureMediaScreen}
      />
      {Screen()}
    </SettingsStack.Navigator>
  );
}

function DiscoverStackScreen() {
  return (
    <SettingsStack.Navigator initialRouteName={"Discover"}>
      <SettingsStack.Screen
        options={{ headerShown: false, gestureEnabled: false }}
        name={"Discover"}
        component={Discover}
      />
      {Screen()}
    </SettingsStack.Navigator>
  );
}

function TopStackScreen() {
  return (
    <SettingsStack.Navigator initialRouteName={"Top"}>
      <SettingsStack.Screen
        options={{ headerShown: false, gestureEnabled: false }}
        name={"Top"}
        component={Top}
      />
      {Screen()}
    </SettingsStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export const MainTabNav = (): JSX.Element => (
  <Tab.Navigator
    initialRouteName="MainTab/Home"
    detachInactiveScreens={false}
    screenOptions={{
      tabBarActiveTintColor: colors.lightText,
      tabBarInactiveTintColor: colors.gray,
      tabBarActiveBackgroundColor: colors.dark,
      tabBarInactiveBackgroundColor: colors.dark,
      tabBarStyle: {
        height: Platform.OS === "ios" ? 90 : 60,
        padding: 0,
        margin: 0,
        backgroundColor: colors.dark,
        borderTopWidth: 0,
      },
      tabBarLabelStyle: { fontWeight: "bold" },
    }}
  >
    <Tab.Screen
      name="MainTab/Home"
      component={HomeStackScreen}
      options={{
        tabBarLabel: "Home",
        tabBarShowLabel: true,
        tabBarIcon: ({ color, size }) => (
          <AntDesign name="home" size={size} color={color} />
        ),
        headerShown: false,
      }}
    />
    <Tab.Screen
      name="MainTab/LiveNow"
      component={LiveNowStackScreen}
      options={{
        tabBarLabel: "Live Now",
        tabBarShowLabel: true,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="md-play-circle" size={size} color={color} />
        ),
        headerShown: false,
      }}
    />
    <Tab.Screen
      name="MainTab/PostVideo"
      component={CaptureMediaScreenStackScreen}
      options={{
        tabBarLabel: "New Post",
        tabBarShowLabel: true,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="add-circle" size={size} color={color} />
        ),
        headerShown: false,
      }}
    />
    <Tab.Screen
      name="MainTab/Discover"
      component={DiscoverStackScreen}
      options={{
        tabBarLabel: "Discover",
        tabBarShowLabel: true,
        tabBarIcon: ({ color, size }) => (
          <Feather name="eye" size={size} color={color} />
        ),
        headerShown: false,
      }}
    />
    <Tab.Screen
      name="MainTab/Top"
      component={TopStackScreen}
      options={{
        tabBarLabel: "Top",
        tabBarShowLabel: true,
        tabBarIcon: ({ color, size }) => (
          <FontAwesome5 name="medal" size={size} color={color} />
        ),
        headerShown: false,
      }}
    />
  </Tab.Navigator>
);

export default MainTabNav;
