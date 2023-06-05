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
import { Platform } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

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
        tabBarLabel: "New Post",
        tabBarShowLabel: true,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="add-circle" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="MainTab/Discover"
      component={Discover}
      options={{
        tabBarLabel: "Discover",
        tabBarShowLabel: true,
        tabBarIcon: ({ color, size }) => (
          <Feather name="eye" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="MainTab/Top"
      component={Top}
      options={{
        tabBarLabel: "Top",
        tabBarShowLabel: true,
        tabBarIcon: ({ color, size }) => (
          <FontAwesome5 name="medal" size={size} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

export default MainTabNav;
