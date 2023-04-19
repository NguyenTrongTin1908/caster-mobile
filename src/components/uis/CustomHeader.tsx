import { Text, View } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';
// import { getStatusBarHeight } from 'react-native-status-bar-height';

interface Props {
  children?: React.ReactElement;
  containerStyle?: { [key: string]: any };
  headerStyle?: { [key: string]: any };
  header?: {
    align: any;
    title: string;
  };
}

export default function CustomHeader({
  children,
  containerStyle = {},
  headerStyle = {},
  header = {
    align: 'center',
    title: ''
  }
}: Props): React.ReactElement {
  return (
    <View style={{ position: 'absolute', top: 10, left: 0.0, right: 0.0, ...containerStyle }}>
      {header.title && (
        <Text textAlign={header.align || 'center'} style={{ ...headerStyle }}>
          {header.title}
        </Text>
      )}
      {children}
    </View>
  );
}
