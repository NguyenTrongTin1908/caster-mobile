import React, { useEffect, useRef, useState } from 'react';
import { PermissionsAndroid, StyleSheet } from 'react-native';
import { PERMISSIONS, requestMultiple, RESULTS } from 'react-native-permissions';

import { Text, VStack, Center, View, Box, Image } from 'native-base';
import { streamService } from 'services/stream.service';
import socketHolder from 'lib/socketHolder';
import { Publisher } from 'components/antmedia/Publisher';
import { Viewer } from 'components/antmedia/Viewer';
import { Container } from './styles';

import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { useNavigation } from '@react-navigation/core';
import { isAndroid } from 'utils/common';
import PublisherIOS from 'components/antmedia/PublisherIOS';

enum EVENT {
  JOINED_THE_ROOM = 'JOINED_THE_ROOM',
  JOIN_ROOM = 'JOIN_ROOM',
  LEAVE_ROOM = 'LEAVE_ROOM',
  STREAM_INFORMATION_CHANGED = 'private-stream/streamInformationChanged',
  MODEL_JOIN_ROOM = 'MODEL_JOIN_ROOM',
  SEND_PAID_TOKEN = 'SEND_PAID_TOKEN',
}

let privateRequestHolder;
let chargerTimeout;
const PrivateCall = ({ route }) => {
  const navigation = useNavigation() as any;

  const { performer } = route.params;
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [localStreamId, setLocalStreamId] = useState(null as any);
  const [remoteStreamId, setRemoteStreamId] = useState('');
  const [privateRequest, setPrivateRequest] = useState({} as any);
  const localStreamRef = useRef({ id: '' }).current;
  const remoteStreamRef = useRef({
    id: '',
  }).current;

  const askAndroidPerissions = async () => {
    const cameraGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Camera Permission',
        message:
          'Application needs access to your camera ' +
          'so you can start video call.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK'
      }
    );
    const audioGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: 'Record Audio Permission',
        message:
          'Application needs access to your audio ' +
          'so you can start video call.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK'
      }
    );

    return {
      cameraGranted: cameraGranted === PermissionsAndroid.RESULTS.GRANTED,
      audioGranted: audioGranted === PermissionsAndroid.RESULTS.GRANTED
    };
  }

  const askIOSPermissions = async () => {
    const statuses = await requestMultiple([
      PERMISSIONS.IOS.CAMERA,
      PERMISSIONS.IOS.MICROPHONE
    ]);
    // console.log('statuses', statuses);
    return {
      cameraGranted: statuses[PERMISSIONS.IOS.CAMERA] === RESULTS.GRANTED,
      audioGranted: statuses[PERMISSIONS.IOS.MICROPHONE] === RESULTS.GRANTED
    };
  }

  const askPermissions = async () => {
    const { cameraGranted, audioGranted } = isAndroid() ? await askAndroidPerissions() : await askIOSPermissions();
    if (
      cameraGranted &&
      audioGranted
    ) {
      setPermissionGranted(true);
    } else {
      // TODO - check me here
    }
  };

  const joinPrivateConversation = (conversationId) => {
    const socket = socketHolder.getSocket() as any;

    // emit this event to receive info of JOINED_THE_ROOM below
    socket.emit(EVENT.JOIN_ROOM, {
      conversationId
    });
  }

  const handleSocketsJoin = async () => {
    const socket = socketHolder.getSocket() as any;

    if (!socket) return;
    socket.on(EVENT.JOINED_THE_ROOM, ({ streamId, conversationId }) => {
      if (!localStreamRef.id) {
        socket.emit('private-stream/join', {
          conversationId,
          streamId,
        });
        localStreamRef.id = streamId;
        setLocalStreamId(streamId);
      } else {
        remoteStreamRef.id = streamId;
      }
    });

    socket.on('private-stream/streamJoined', ({ conversationId, streamId }) => {
      if (localStreamRef.id !== streamId) {
        // remoteStreamId
        // console.log(
        //   'model join >>> private-stream/streamJoined',
        //   conversationId,
        //   streamId
        // );
        const cId = privateRequest?.conversation?._id || privateRequestHolder?.conversation?._id;
        if (cId === conversationId) {
          remoteStreamRef.id = streamId;
          setRemoteStreamId(streamId);
        }
      }
    });
  };

  const handleSocketLeave = () => {
    // TODO - handle me
    const socket = socketHolder.getSocket() as any;
    socket.off(EVENT.JOINED_THE_ROOM);
    socket.off('private-stream/streamJoined');
    socket.off(EVENT.MODEL_JOIN_ROOM);
    const conversationId = privateRequest?.conversation?._id || privateRequestHolder?.conversation?._id;
    if (conversationId) {
      socket.emit('private-stream/leave', {
        conversationId,
        streamId: localStreamRef.id
      });
      socket.emit(EVENT.LEAVE_ROOM, {
        conversationId
      });
    }
  };

  const requestPrivateCall = async () => {
    if (!performer) return;
    const { _id: performerId } = performer as any;
    streamService.requestPrivateChat(performerId).then((res) => {
      privateRequestHolder = res.data;
      setPrivateRequest(res.data);
      const { conversation } = res.data;
      joinPrivateConversation(conversation._id)
    });
  };

  const hangUp = async () => {
    // TODO - send socket event to stop, wait for local stream stop then navigate
    // return back
    navigation.navigate('PerformerDetail', {
      username: performer.username
    });
  };

  const chargeInterval = async () => {
    try {
      const conversationId = privateRequest?.conversation?._id || privateRequestHolder?.conversation?._id;
      if (!conversationId) throw new Error('Cannot find conversation!');
      await streamService.sendPaidToken(conversationId);

      chargerTimeout = setTimeout(() => chargeInterval(), 60 * 1000);
    } catch (e) {
      // console.log('charge error', e);
      hangUp();
    }
  };


  const renderLocalVideo = () => {
    if (!localStreamId) return null;

    if (isAndroid()) {
      return <Publisher streamId={localStreamId} />;
    }

    return <PublisherIOS streamId={localStreamId} />;
  };

  const renderPerformerVideo = () => {
    if (!remoteStreamRef.id) return null;
    return !!remoteStreamRef.id && <Viewer streamId={remoteStreamRef.id} onJoined={chargeInterval} />;
  };


  useEffect(() => {
    askPermissions();
    handleSocketsJoin();

    return () => {
      privateRequestHolder = null;
      chargerTimeout && clearTimeout(chargerTimeout);
      handleSocketLeave();
    };
  }, []);

  if (!permissionGranted) return (
    <View>
      <Text>
        You need to provide video and audio permission to start the call
      </Text>

      <TouchableOpacity onPress={askPermissions}>
        <Text>Send request</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Container is-playing>
      <Image
        source={{ uri: performer?.avatar }}
        style={{ width: '100%', height: '100%' }}
        resizeMode="cover"
        alignSelf="center"
        flex={1}
        alt="background"
      />
      <View
        position="absolute"
        top={160}
        justifyContent="center"
        w="100%"
        alignItems="center"
      >
        <Image
          source={{ uri: performer?.avatar }}
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
            {performer?.name || performer?.username}
          </Text>
        </View>
        <View>
          <Text color="white" style={{ fontSize: 17, marginTop: 2 }}>
            {performer?.privateCallPrice} tokens per minute
          </Text>
          {privateRequest?.conversation && <Text>Contacting...</Text>}
        </View>
      </View>

      <View
        flexDirection="row"
        justifyContent="center"
        position="absolute"
        bottom={94}
        w="100%"
        left={0}
        zIndex={3}
      >
        <TouchableOpacity
          style={[styles.button, styles.bg2, { marginRight: 55 }]}
          onPress={hangUp}
        >
          <MaterialCommunityIcons
            name="phone-hangup"
            size={24}
            color="#ffffff"
          />
        </TouchableOpacity>
        {!privateRequest?.conversation &&
          <TouchableOpacity
            style={[styles.button, styles.bg1]}
            onPress={requestPrivateCall}
          >
            <Feather name="phone" size={24} color="#ffffff" />
          </TouchableOpacity>
        }
      </View>

      {renderLocalVideo()}

      {renderPerformerVideo()}
    </Container>
  );
};


const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bg1: { backgroundColor: '#1ED760' },
  bg2: { backgroundColor: '#FE294D' }
});


export default PrivateCall;
