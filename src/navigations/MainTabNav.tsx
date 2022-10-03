import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import React from "react";
import Home from "screens/browse/Home";
// import Meet from 'screens/meet/Meet';
import Trending from "screens/trending/Trending";
import Profile from "screens/profile/Profile";
import Blank from "screens/blank";
import CaptureMediaScreen from "screens/media/CaptureMedia";
import Model from "screens/model/Model";
import LiveNow from "screens/livenow/LiveNow";

import { colors } from "utils/theme";
import { Platform } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

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
      },
      tabBarLabelStyle: { fontWeight: "bold" },
    }}
  >
    <Tab.Screen
      name="MainTab/Home"
      component={Home}
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
      component={LiveNow}
      options={{
        tabBarLabel: "Live Now",
        tabBarShowLabel: true,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="md-play-circle" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="MainTab/PostVideo"
      component={CaptureMediaScreen}
      options={{
        tabBarLabel: "Post Video",
        tabBarShowLabel: true,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="add-circle" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="MainTab/Trending"
      component={Trending}
      options={{
        tabBarLabel: "Trending",
        tabBarShowLabel: true,
        tabBarIcon: ({ color, size }) => (
          <Feather name="trending-up" size={size} color={color} />
        ),
      }}
    />

    <Tab.Screen
      name="MainTab/Top"
      component={Model}
      options={{
        tabBarLabel: "Top",
        tabBarShowLabel: true,
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons
            name="crown-outline"
            size={size + 8}
            color={color}
          />
        ),
      }}
    />
  </Tab.Navigator>
);

export default MainTabNav;
