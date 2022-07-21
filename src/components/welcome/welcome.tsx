import { Text, View } from 'react-native';
import React from 'react';

export default function Welcome(): JSX.Element {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 20 }}>Loading...</Text>
    </View>
  );
}
