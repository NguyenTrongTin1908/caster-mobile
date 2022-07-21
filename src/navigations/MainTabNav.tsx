import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import React from 'react';
import Home from 'screens/browse/Home';
import Meet from 'screens/meet/Meet';
import PrivateChatList from 'screens/chat/PrivateChatList';
import TokenPackage from 'screens/token-package/TokenPackage';
import Profile from 'screens/profile/Profile';
import { colors } from 'utils/theme';

const Tab = createBottomTabNavigator();

export const MainTabNav = (): JSX.Element => (
  <Tab.Navigator
    initialRouteName="MainTab/Home"
    screenOptions={{
      tabBarActiveTintColor: colors.light,
      tabBarInactiveTintColor: colors.active,
      tabBarActiveBackgroundColor: colors.active
    }}>
    <Tab.Screen
      name="MainTab/Home"
      component={Home}
      options={{
        tabBarLabel: 'Start',
        tabBarShowLabel: true,
        tabBarIcon: ({ color, size }) => <AntDesign name="home" size={size} color={color} />,
        headerShown: false
      }}
    />
    <Tab.Screen
      name="MainTab/Meet"
      component={Meet}
      options={{
        tabBarLabel: 'Rooms',
        tabBarShowLabel: true,
        tabBarIcon: ({ color, size }) => <Feather name="search" size={size} color={color} />
      }}
    />
    <Tab.Screen
      name="MainTab/Messages"
      component={PrivateChatList}
      options={{
        unmountOnBlur: true,
        tabBarLabel: 'Chats',
        tabBarShowLabel: true,
        tabBarIcon: ({ color, size }) => <Ionicons name="chatbubble-ellipses-outline" size={size} color={color} />
      }}
    />
    <Tab.Screen
      name="MainTab/TokenPackage"
      component={TokenPackage}
      options={{
        tabBarLabel: 'Tokens',
        tabBarShowLabel: true,
        tabBarIcon: ({ color, size }) => <AntDesign name="gift" size={size} color={color} />
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
