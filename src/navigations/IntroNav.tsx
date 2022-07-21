import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Intro from 'screens/Intro';
import Login from 'screens/auth/Login';
import Register from 'screens/auth/Register';
import ForgotPassword from 'screens/auth/ForgotPassword';

export type IntroStackList = {
  'IntroNav/Intro': undefined;
  'IntroNav/Login': undefined;
  'IntroNav/Register': undefined;
  'IntroNav/ForgotPassword': undefined;
};

const Stack = createStackNavigator<IntroStackList>();

export const IntroNav = (): JSX.Element => (
  <Stack.Navigator initialRouteName={'IntroNav/Login'}>
    <Stack.Screen
      options={{ headerShown: false }}
      name="IntroNav/Intro"
      component={Intro}
    />
    <Stack.Screen
      options={{ title: 'Login' }}
      name="IntroNav/Login"
      component={Login}
    />
    <Stack.Screen
      options={{ title: 'Register' }}
      name="IntroNav/Register"
      component={Register}
    />
    <Stack.Screen
      options={{ title: 'ForgotPassword' }}
      name="IntroNav/ForgotPassword"
      component={ForgotPassword}
    />
  </Stack.Navigator>
);

export default IntroNav;
