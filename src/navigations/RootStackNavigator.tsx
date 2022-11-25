import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import {
  StackNavigationProp,
  createStackNavigator,
} from "@react-navigation/stack";
import { createNavigationContainerRef } from "@react-navigation/native";
import { connect } from "react-redux";
import React from "react";
import navigationHolder from "lib/navigationHolder";
import { colors } from "utils/theme";
import IntroNav from "./IntroNav";
import MainTabNav from "./MainTabNav";
import ChatRoom from "screens/chat/ChatRoom";
import PrivateChatDetail from "screens/chat/PrivateChatDetail";
import PerformerDetail from "screens/performer/PerformerDetail";
import Call from "screens/call/Call";
import Calling from "screens/call/Calling";
import LiveNow from "screens/livenow/LiveNow";
import FeedDetail from "screens/detail/feedDetail";
import { IPerformer } from "interfaces/performer";
import MediaPreview from "screens/media/MediaPreview";
import Upload from "screens/feed/Upload";
import Home from "screens/browse/Home";
import Model from "screens/model/Model";
import Hashtag from "screens/hashtag/Hashtag";
import ListFollow from "screens/follow/listFollow";
import Trending from "screens/trending/Trending";
import ModelProfile from "screens/model/profile/ModelProfile";
import Bookmarks from "screens/model/bookmarks/Bookmarks";
import Profile from "screens/profile/Profile";
import FollowPost from "screens/followPost/FollowPost";
import PushNotificationSetting from "screens/notification/component/PushNotificationSetting";
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
export type RootStackParamList = {
  default: undefined;
  IntroNav: undefined;
  MainTabNav: undefined;
  Call: undefined;
  Calling: undefined;
  LiveNow: undefined;
  Model: undefined;
  Profile: undefined;
  ModelProfile: undefined;
  EditProfile: undefined;
  FollowPost: undefined;
  PushNotificationSetting: undefined;
  NotificationPage: undefined;
  ListFollow: { performer: IPerformer };
  Hashtag: { query: string; currentTab: string };
  Trending: undefined;
  Wallet: undefined;
  TokenPackage: undefined;
  ModelOrderPage: undefined;
  ViewPublicStream: undefined;
  Blank: undefined;
  // ChatRoom: { performer: IPerformer };
  PrivateChatDetail: { performer: IPerformer; conversationId: string };
  PrivateChat: undefined;
  PerformerDetail: { username: string };
  MediaPreview: {
    path: string;
    type: "video" | "photo";
  };
  Upload: {
    path: string;
    type: "video" | "photo";
  };
  Home: {};
  PublicStream: undefined;
  FeedDetail: { performerId: any; type: "video" | "photo" };
  OrderDetailPage: { id: any };
  Bookmarks: undefined;
  GoLivePage: undefined;
  PrivateChatWaitingRoom: undefined;
  PrivateUserWaitingRoom: { performer: IPerformer };
  PrivateUserAcceptRoom: { performer: IPerformer };
};
export type RootStackNavigationProps<
  T extends keyof RootStackParamList = "default"
> = StackNavigationProp<RootStackParamList, T>;
const Stack = createStackNavigator<RootStackParamList>();
export const navigationRef = createNavigationContainerRef() as any;
function RootNavigator({ loggedIn }): React.ReactElement {
  const defaultRouteName = loggedIn ? "MainTabNav" : "IntroNav";
  const CustomTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colors.appBgColor,
    },
  };
  return (
    <NavigationContainer
      ref={navigationRef}
      theme={CustomTheme}
      onReady={() => navigationHolder.setNav(navigationRef)}
    >
      <Stack.Navigator initialRouteName={defaultRouteName}>
        <Stack.Screen
          options={{ headerShown: false }}
          name="Blank"
          component={Blank}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Call"
          component={Call}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Calling"
          component={Calling}
        />

        <Stack.Screen
          options={{ headerShown: false }}
          name="PublicStream"
          component={PublicStream}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="ViewPublicStream"
          component={ViewPublicStream}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="GoLivePage"
          component={GoLivePage}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="PrivateChatWaitingRoom"
          component={PrivateChatWaitingRoom}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="PrivateUserWaitingRoom"
          component={PrivateUserWaitingRoom}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="PrivateUserAcceptRoom"
          component={PrivateUserAcceptRoom}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="PrivateChat"
          component={PrivateChat}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="IntroNav"
          component={IntroNav}
        />
        <Stack.Screen
          options={{
            title: "Browse",
            headerShown: false,
            gestureEnabled: false,
          }}
          name="MainTabNav"
          component={MainTabNav}
        />
        {/* <Stack.Screen
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
          name="ChatRoom"
          component={ChatRoom}
        /> */}
        <Stack.Screen
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
          name="ListFollow"
          component={ListFollow}
        />

        <Stack.Screen
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
          name="PushNotificationSetting"
          component={PushNotificationSetting}
        />

        <Stack.Screen
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
          name="FollowPost"
          component={FollowPost}
        />

        <Stack.Screen
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
          name="PrivateChatDetail"
          component={PrivateChatDetail}
        />
        <Stack.Screen
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
          name="OrderDetailPage"
          component={OrderDetailPage}
        />
        <Stack.Screen
          options={{ headerShown: false, gestureEnabled: false }}
          name="PerformerDetail"
          component={PerformerDetail}
        />
        <Stack.Screen
          options={{ headerShown: false, gestureEnabled: false }}
          name="LiveNow"
          component={LiveNow}
        />
        <Stack.Screen
          options={{ headerShown: false, gestureEnabled: false }}
          name="NotificationPage"
          component={NotificationPage}
        />
        <Stack.Screen
          options={{ headerShown: false, gestureEnabled: false }}
          name="Profile"
          component={Profile}
        />
        <Stack.Screen
          options={{ headerShown: false, gestureEnabled: false }}
          name="Wallet"
          component={Wallet}
        />
        <Stack.Screen
          options={{ headerShown: false, gestureEnabled: false }}
          name="TokenPackage"
          component={TokenPackage}
        />
        <Stack.Screen
          options={{ headerShown: false, gestureEnabled: false }}
          name="Bookmarks"
          component={Bookmarks}
        />
        <Stack.Screen
          options={{ headerShown: false, gestureEnabled: false }}
          name="ModelOrderPage"
          component={ModelOrderPage}
        />
        <Stack.Screen
          options={{ headerShown: false, gestureEnabled: false }}
          name="MediaPreview"
          component={MediaPreview}
        />
        <Stack.Screen
          options={{ headerShown: false, gestureEnabled: false }}
          name="Upload"
          component={Upload}
        />
        <Stack.Screen
          options={{ headerShown: false, gestureEnabled: false }}
          name="Home"
          component={Home}
        />
        <Stack.Screen
          options={{ headerShown: false, gestureEnabled: false }}
          name="FeedDetail"
          component={FeedDetail}
        />
        <Stack.Screen
          options={{ headerShown: false, gestureEnabled: false }}
          name="Model"
          component={Model}
        />

        {/* <Stack.Screen
          options={{ headerShown: false, gestureEnabled: false }}
          name="Profile"
          component={Profile}
        /> */}

        <Stack.Screen
          options={{ headerShown: false, gestureEnabled: false }}
          name="ModelProfile"
          component={ModelProfile}
        />

        <Stack.Screen
          options={{ headerShown: false, gestureEnabled: false }}
          name="EditProfile"
          component={EditProfile}
        />

        <Stack.Screen
          options={{ headerShown: false, gestureEnabled: false }}
          name="Hashtag"
          component={Hashtag}
        />
        <Stack.Screen
          options={{ headerShown: false, gestureEnabled: false }}
          name="Trending"
          component={Trending}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const mapStateToProp = (state: any) => ({
  loggedIn: state.auth.loggedIn,
});
export default connect(mapStateToProp)(RootNavigator);
