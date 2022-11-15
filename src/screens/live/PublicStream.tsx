import React, { useEffect, useState } from 'react';
import { Button, View, Heading } from 'native-base';
import { connect } from 'react-redux';
import { IUser } from 'src/interfaces';
import { streamService } from '../../services';
import { PermissionsAndroid, Text } from 'react-native';
import { PERMISSIONS, requestMultiple, RESULTS } from 'react-native-permissions';
import socketHolder from 'lib/socketHolder';

import { getStreamConversation, resetStreamMessage } from 'services/redux/stream-chat/actions';
import { WEBRTC_ADAPTOR_INFORMATIONS } from 'components/antmedia/constants';
import styles from './style';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderMenu from 'components/tab/HeaderMenu';
import { colors, Sizes } from 'utils/theme';
import { isAndroid } from 'utils/common';
import { Publisher } from 'components/antmedia/Publisher';
import PublisherIOS from 'components/antmedia/PublisherIOS';
import ChatBox from 'components/streamChat/chat-box';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import EmojiSelector from "react-native-emoji-selector";

interface IProps {
  resetStreamMessage: Function;
  getStreamConversation: Function;
  activeConversation: any;
  currentUser: IUser;
  system: any;
}

const PublicStream = ({
  resetStreamMessage,
  getStreamConversation,
  activeConversation,
  currentUser,
  system
}: IProps) => {
  let publisherRef: any;
  let publisherRef2: any;

  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [sessionId, setSessionid] = useState(null) as any;
  const [total, setTotal] = useState(0);
  const [members, setMembers] = useState([]);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [localStreamId, setLocalStreamId] = useState(null as any);

  useEffect(() => {
    askPermissions();
    // joinPublicRoom();
    const socket = socketHolder.getSocket() as any;

    socket.on('public-room-changed', handler);

    return () => {
      leavePublicRoom();
    };
  }, []);

  const askAndroidPerissions = async () => {
    const cameraGranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
      title: 'Camera Permission',
      message: 'Application needs access to your camera ' + 'so you can start video call.',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK'
    });
    const audioGranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, {
      title: 'Record Audio Permission',
      message: 'Application needs access to your audio ' + 'so you can start video call.',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK'
    });
    return {
      cameraGranted: cameraGranted === PermissionsAndroid.RESULTS.GRANTED,
      audioGranted: audioGranted === PermissionsAndroid.RESULTS.GRANTED
    };
  };
  const askIOSPermissions = async () => {
    const statuses = await requestMultiple([PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE]);
    return {
      cameraGranted: statuses[PERMISSIONS.IOS.CAMERA] === RESULTS.GRANTED,
      audioGranted: statuses[PERMISSIONS.IOS.MICROPHONE] === RESULTS.GRANTED
    };
  };

  const askPermissions = async () => {
    const { cameraGranted, audioGranted } = isAndroid() ? await askAndroidPerissions() : await askIOSPermissions();
    if (cameraGranted && audioGranted) {
      setPermissionGranted(true);
    } else {
    }
  };
  const handleMember = ({ total, members }) => {
    setTotal(total);
    setMembers(members);
  };
  const setStreamRef = dataFunc => {
    publisherRef2 = dataFunc;
  };
  const stop = () => {
    // if (!initialized) {
    //   return;
    // }
    leavePublicRoom();
  };
  const callback = (info: WEBRTC_ADAPTOR_INFORMATIONS) => {
    if (activeConversation && activeConversation.data) {
      // const socket = this.context;
      const socket = socketHolder.getSocket() as any;
      if (info === WEBRTC_ADAPTOR_INFORMATIONS.INITIALIZED) {
        setInitialized(true);
        console.log('INITIALIZED');
        // if (publisherRef.publish) publisherRef.publish(sessionId);
        // else publisherRef2.publish(sessionId);
      } else if (info === WEBRTC_ADAPTOR_INFORMATIONS.PUBLISH_STARTED) {
        const conversation = { ...activeConversation.data };
        socket.emit('public-stream/live', { conversationId: conversation._id });
        console.log('public');

        setLoading(false);
      } else if (info === WEBRTC_ADAPTOR_INFORMATIONS.PUBLISH_FINISHED) {
        console.log('finished');

        setLoading(false);
      } else if (info === WEBRTC_ADAPTOR_INFORMATIONS.CLOSED) {
        setLoading(false);
        console.log('close');
        setInitialized(false);
      }
    }
  };
  const joinPublicRoom = async () => {
    const socket = socketHolder.getSocket() as any;
    try {
      setLoading(true);
      const resp = await streamService.goLive();
      const { conversation } = resp.data;
      const { streamId } = conversation;
      const { sessionId } = resp.data;

      if (conversation && conversation._id) {
        getStreamConversation({
          conversation
        });

        socket &&
          (await socket.emit('public-stream/join', {
            conversationId: conversation._id
          }));
        socket &&
          (await socket.emit('public-stream/live', {
            conversationId: conversation._id
          }));
        setLocalStreamId(streamId);
        await setSessionid(sessionId);
      }
    } catch (e) {
      const error = await Promise.resolve(e);
    } finally {
      setLoading(false);
    }
  };

  const leavePublicRoom = () => {
    const socket = socketHolder.getSocket() as any;
    if (socket && activeConversation && activeConversation.data) {
      const conversation = { ...activeConversation.data };
      socket.emit('public-stream/leave', { conversationId: conversation._id });
      resetStreamMessage();
      setSessionid(null);
      setInitialized(false);
    }
  };
  const start = async () => {
    setLoading(true);
    try {
      setInitialized(true);
      joinPublicRoom();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('error_broadcast', await e);
    } finally {
      setLoading(false);
    }
  };
  const handler = ({ total, members }) => {
    console.log('Vo');
    setTotal(total);
    setMembers(members);
  };

  const renderLocalVideo = () => {
    if (isAndroid()) {
      return <Publisher streamId={localStreamId} onChange={callback} />;
    }

    return <PublisherIOS streamId={localStreamId} />;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Heading mb={4} fontSize={30} textAlign="center" letterSpacing={-1} color={colors.lightText} bold>
        Live Broadcaster
      </Heading>

      <HeaderMenu />
      {sessionId && (
        <View
          style={{
            position: 'absolute',
            marginTop: Sizes.fixPadding + 160.0,
            alignItems: 'center',
            alignSelf: 'flex-end',
            zIndex: 1000
          }}>
          <MaterialIcons name="visibility" color={colors.light} size={28} />
          <Text
            style={{
              marginTop: Sizes.fixPadding - 7.0,
              color: colors.lightText
            }}>
            {total}
          </Text>
        </View>
      )}
      <View flex={1}>{sessionId && renderLocalVideo()}</View>

      <ChatBox />

      <View>
        {!initialized ? (
          <Button onPress={() => start()}>Start Streaming</Button>
        ) : (
          <Button onPress={() => stop()}>Stop Streaming</Button>
        )}
      </View>
      {/* <View style={styles.emotion}>
        {
          <EmojiSelector
            showSearchBar={false}
            showSectionTitles={false}
            onEmojiSelected={() => {}}
          />
        }
      </View> */}
    </SafeAreaView>
  );
};

const mapStateToProps = state => ({
  currentUser: state.user.current,
  activeConversation: state.streamMessage.activeConversation,
  system: { ...state.system }
});
const mapDispatchs = {
  getStreamConversation,
  resetStreamMessage
};
export default connect(mapStateToProps, mapDispatchs)(PublicStream);
