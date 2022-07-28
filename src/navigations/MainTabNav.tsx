import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import React from 'react';
import Home from 'screens/browse/Home';
import Meet from 'screens/meet/Meet';
import LiveNow from 'screens/live/LiveNow';

import PrivateChatList from 'screens/chat/PrivateChatList';
import TokenPackage from 'screens/token-package/TokenPackage';
import Profile from 'screens/profile/Profile';
import { colors } from 'utils/theme';

const Tab = createBottomTabNavigator();

export const MainTabNav = (): JSX.Element => (
  <Tab.Navigator
    initialRouteName="MainTab/Home"
    screenOptions={{
      tabBarActiveTintColor: colors.lightText,
      tabBarInactiveTintColor: colors.gray,
      tabBarActiveBackgroundColor: colors.dark,
      tabBarInactiveBackgroundColor: colors.dark
    }}>
    <Tab.Screen
      name="MainTab/Home"
      component={Home}
      options={{
        tabBarLabel: 'Home',
        tabBarShowLabel: true,
        tabBarIcon: ({ color, size }) => <AntDesign name="home" size={size} color={color} />,
        headerShown: false
      }}
    />
    <Tab.Screen
      name="MainTab/Meet"
      component={Meet}
      options={{
        tabBarLabel: 'Trending',
        tabBarShowLabel: true,
        tabBarIcon: ({ color, size }) => <Feather name="trending-up" size={size} color={color} />
      }}
    />
    <Tab.Screen
      name="MainTab/Messages"
      component={PrivateChatList}
      options={{
        unmountOnBlur: true,
        tabBarLabel: 'Post Video',
        tabBarShowLabel: true,
        tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" size={size} color={color} />
      }}
    />
    <Tab.Screen
      name="MainTab/TokenPackage"
      component={TokenPackage}
      options={{
        tabBarLabel: 'Notifications',
        tabBarShowLabel: true,
        tabBarIcon: ({ color, size }) => <Ionicons name="notifications" size={size} color={color} />
      }}
    />
    <Tab.Screen
      name="MainTab/Profile"
      component={Profile}
      options={{
        tabBarLabel: 'Profile',
        tabBarShowLabel: true,
        tabBarIcon: ({ color, size }) => <EvilIcons name="user" size={size + 8} color={color} />
      }}
    />
  </Tab.Navigator>
);

export default MainTabNav;
