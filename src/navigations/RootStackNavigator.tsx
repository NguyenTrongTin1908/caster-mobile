import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import {
  StackNavigationProp,
  createStackNavigator
} from '@react-navigation/stack';
import { createNavigationContainerRef } from '@react-navigation/native';
import { connect } from 'react-redux';
import React from 'react';
import navigationHolder from 'lib/navigationHolder';
import { colors } from 'utils/theme';

import IntroNav from './IntroNav';
import MainTabNav from './MainTabNav';
import ChatRoom from 'screens/chat/ChatRoom';
import PrivateChatDetail from 'screens/chat/PrivateChatDetail';
import PerformerDetail from 'screens/performer/PerformerDetail';
import Call from 'screens/call/Call';
import Calling from 'screens/call/Calling';
import { IPerformer } from 'interfaces/performer';

export type RootStackParamList = {
  default: undefined;
  IntroNav: undefined;
  MainTabNav: undefined;
  Call: undefined;
  Calling: undefined;
  ChatRoom: { performer: IPerformer };
  PrivateChatDetail: { performer: IPerformer; conversationId: string };
  PerformerDetail: { username: string };
};

export type RootStackNavigationProps<
  T extends keyof RootStackParamList = 'default'
> = StackNavigationProp<RootStackParamList, T>;

const Stack = createStackNavigator<RootStackParamList>();

export const navigationRef = createNavigationContainerRef() as any;

function RootNavigator({ loggedIn }): React.ReactElement {
  const defaultRouteName = loggedIn ? 'MainTabNav' : 'IntroNav';

  const CustomTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colors.appBgColor
      // overwrite default color, check here https://reactnavigation.org/docs/themes/
      // primary: 'rgb(255, 45, 85)',
      // background: 'rgb(242, 242, 242)',
      // card: 'rgb(255, 255, 255)',
      // text: 'rgb(28, 28, 30)',
      // border: 'rgb(199, 199, 204)',
      // notification: 'rgb(255, 69, 58)'
    }
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={CustomTheme}
      onReady={() => navigationHolder.setNav(navigationRef)}>
      <Stack.Navigator initialRouteName={defaultRouteName}>
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
          name="IntroNav"
          component={IntroNav}
        />
        <Stack.Screen
          options={{
            title: 'Browse',
            headerShown: false,
            gestureEnabled: false
          }}
          name="MainTabNav"
          component={MainTabNav}
        />

        <Stack.Screen
          options={{
            headerShown: false,
            gestureEnabled: false
          }}
          name="ChatRoom"
          component={ChatRoom}
        />
        <Stack.Screen
          options={{
            headerShown: false,
            gestureEnabled: false
          }}
          name="PrivateChatDetail"
          component={PrivateChatDetail}
        />
        <Stack.Screen
          options={{ headerShown: false, gestureEnabled: false }}
          name="PerformerDetail"
          component={PerformerDetail}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const mapStateToProp = (state: any) => ({
  loggedIn: state.auth.loggedIn
});
export default connect(mapStateToProp)(RootNavigator);
