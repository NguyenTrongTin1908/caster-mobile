import React from "react";
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import bottomTabBarScreen from "./components/bottomTabBarScreen";
import LoadingScreen from "./components/loadingScreen";
import editProfileScreen from "./screens/editProfile/editProfileScreen";
import messageScreen from "./screens/message/messageScreen";
import postScreen from "./screens/post/postScreen";
import profileSettingsScreen from "./screens/profileSettings/profileSettingsScreen";
import splashScreen from "./screens/splashScreen";
import termsOfUseScreen from "./screens/termsOfUse/termsOfUseScreen";
import videoMakerProfileScreen from "./screens/videoMakerProfile/videoMakerProfileScreen";
import loginScreen from "./screens/auth/loginScreen";
import verificationScreen from "./screens/auth/verificationScreen";
import registerScreen from "./screens/auth/registerScreen";

const switchNavigator = createSwitchNavigator({
  Loading: LoadingScreen,
  Splash: splashScreen,
  mainFlow: createStackNavigator({
    Login: loginScreen,
    Register: registerScreen,
    Verification: verificationScreen,
    BottomTabBar: {
      screen: bottomTabBarScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    Post: postScreen,
    Messages: messageScreen,
    EditProfile: editProfileScreen,
    ProfileSettings: profileSettingsScreen,
    TermsOfUse: termsOfUseScreen,
    VideoMakerProfile: videoMakerProfileScreen,
  }),
},
  {
    initialRouteName: 'Loading',
    transitionSpec: {
      duration: 400,
    },
  });

const App = createAppContainer(switchNavigator);

export default () => {
  return (
    <App />
  );
};

