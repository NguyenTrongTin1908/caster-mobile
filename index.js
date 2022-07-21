/**
 * @format
 */

import React from 'react';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';

import 'react-native-gesture-handler';
import { App } from './App';

const InitialComponent = () => {
  return <App />;
};

AppRegistry.registerComponent(appName, () => InitialComponent);
