import React, { useEffect, useRef, useState } from 'react';
import { Button, View, Text } from 'native-base';
import { SignalingChannel } from './SignalingChannel';

import {
  MediaStream,
  RTCPeerConnection,
  RTCSessionDescriptionType,
  RTCView
} from 'react-native-webrtc';
import { config } from 'config';
import SendTip from 'components/message/SendTip';
import KeyboardDismiss from 'components/uis/KeyboardDismiss';
import { StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/core';

export const Viewer = ({ streamId, performer, conversation, username }) => {
  const navigation = useNavigation() as any;
  const [modal, setModal] = useState(false);
  const [remoteStream, setRemoteStream] = useState<MediaStream>();

  const peerConnection = useRef<RTCPeerConnection>();

  const startStreaming = async (
    remoteDescription: RTCSessionDescriptionType
  ) => {
    peerConnection.current = new RTCPeerConnection({
      iceServers: []
    });

    peerConnection.current.onaddstream = (event) => {
      console.log('on add stream');
      setRemoteStream(event.stream);
    };

    peerConnection.current.onremovestream = () => console.log('stream removed');

    peerConnection.current.onconnectionstatechange = (event) =>
      console.log(
        'state change connection: ',
        peerConnection.current?.connectionState
      );

    peerConnection.current.onsignalingstatechange = () =>
      console.log(peerConnection.current?.signalingState);

    peerConnection.current.onicecandidateerror = console.log;

    peerConnection.current.onicecandidate = (event) => {
      const candidate = event.candidate;
      if (
        candidate &&
        signalingChannel.current?.isChannelOpen() &&
        peerConnection.current?.signalingState === 'have-remote-offer'
      ) {
        console.log('sending local ice candidates');
        signalingChannel.current?.sendJSON({
          command: 'takeCandidate',
          streamId,
          label: candidate.sdpMLineIndex.toString(),
          id: candidate.sdpMid,
          candidate: candidate.candidate
        });
      }
    };

    await peerConnection.current?.setRemoteDescription(remoteDescription);

    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);
  };

  const signalingChannel = useRef<SignalingChannel>(
    new SignalingChannel(config.ANT_SIGNALING_URL, {
      onopen: () => {
        signalingChannel.current?.sendJSON({
          command: 'play',
          streamId
        });
      },
      start: async () => {},
      stop: () => {
        console.log('stop called');
      },
      takeCandidate: (data) => {
        console.log('onIceCandidate remote');
        peerConnection.current?.addIceCandidate({
          candidate: data?.candidate || '',
          sdpMLineIndex: Number(data?.label) || 0,
          sdpMid: data?.id || ''
        });
      },
      takeConfiguration: async (data) => {
        console.log('got offer: ', data?.type);
        const offer = data?.sdp || '';

        await startStreaming({
          sdp: offer,
          type: data?.type || ''
        });

        signalingChannel.current?.sendJSON({
          command: 'takeConfiguration',
          streamId,
          type: 'answer',
          sdp: peerConnection?.current?.localDescription?.sdp
        });
      }
    })
  );

  const stopStream = () => {
    signalingChannel.current.close();
    navigation.navigate('PerformerDetail', { username });
  };

  useEffect(() => {
    return () => {
      signalingChannel.current.close();
    };
  }, []);

  return (
    <KeyboardDismiss>
      <View style={{ height: '100%', width: '100%' }}>
        {!!remoteStream && (
          <RTCView
            streamURL={remoteStream?.toURL()}
            style={{ flex: 1 }}
            objectFit="cover"
          />
        )}
        <View
          style={{
            flexDirection: 'row',
            position: 'absolute',
            bottom: 100,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <Button
            style={[styles.button, styles.bg3, { width: 60, height: 60 }]}
          >
            <AntDesign name="sound" size={24} color="#ffffff" />
          </Button>
          <Button
            ml={25}
            mr={25}
            style={[styles.button, styles.bg1, { width: 118, height: 46 }]}
            onPress={() => setModal(true)}
          >
            SendTip
          </Button>
          <Button
            onPress={stopStream}
            style={[styles.button, styles.bg2, { width: 60, height: 60 }]}
          >
            <MaterialCommunityIcons
              name="phone-hangup"
              size={24}
              color="#ffffff"
            />
          </Button>
        </View>
        <SendTip
          setModal={setModal}
          modal={modal}
          conversationId={conversation}
          performerId={performer || ''}
        />
      </View>
    </KeyboardDismiss>
  );
};
const styles = StyleSheet.create({
  button: {
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bg1: { backgroundColor: '#ff6534' },
  bg2: { backgroundColor: '#FE294D' },
  bg3: { backgroundColor: '#000000' }
});
