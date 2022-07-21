import { Box, Image, Text, View } from 'native-base';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/core';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bg1: { backgroundColor: '#1ED760' },
  bg2: { backgroundColor: '#FE294D' },
});

interface IProps {
  route: {
    params: {
      username: string;
      performerId: string;
      privateCallPrice: number;
      conversationId: string;
      avatar: string;
    };
  };
}

export default function Calling({ route }: IProps) {
  const { username, performerId, privateCallPrice, conversationId, avatar } =
    route.params;
  const navigation = useNavigation() as any;

  const hangingUp = () => {
    navigation.navigate('PerformerDetail', {
      username,
    });
  };

  const stream = () => {
    navigation.navigate('Call', {
      performerId,
      privateCallPrice,
      conversationId,
    });
  };

  return (
    <Box flex={1}>
      <Image
        source={{ uri: avatar }}
        style={{ width: '100%', height: '100%' }}
        resizeMode="cover"
        alignSelf="center"
        flex={1}
        alt="background"
      />
      <View
        flexDirection="row"
        justifyContent="center"
        position="absolute"
        bottom={94}
        w="100%"
        left={0}
      >
        <TouchableOpacity
          style={[styles.button, styles.bg2, { marginRight: 55 }]}
          // onPress={hangingUp}
        >
          <MaterialCommunityIcons
            name="phone-hangup"
            size={24}
            color="#ffffff"
          />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.bg1]} 
          // onPress={stream}
        >
          <Feather name="phone" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
      <View
        position="absolute"
        top={160}
        justifyContent="center"
        w="100%"
        alignItems="center"
      >
        <Image
          source={{ uri: avatar }}
          resizeMode="cover"
          alignSelf="center"
          style={{ width: 80, height: 80 }}
          borderRadius={50}
          alt="background"
        />
        <View>
          <Text
            color="white"
            style={{ fontWeight: 'bold', fontSize: 24, marginTop: 13 }}
          >
            {username}
          </Text>
        </View>
        <View>
          <Text color="white" style={{ fontSize: 17, marginTop: 2 }}>
            Contacting...
          </Text>
        </View>
      </View>
    </Box>
  );
}
