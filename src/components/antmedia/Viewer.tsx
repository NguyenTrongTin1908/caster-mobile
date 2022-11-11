import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SignalingChannel } from './SignalingChannel';

import { MediaStream, RTCPeerConnection, RTCSessionDescription } from 'react-native-webrtc';
import { config } from 'config';
import { RemoteView } from './styles';

export const Viewer = ({ streamId, onJoined = () => {} }) => {
  const [remoteStream, setRemoteStream] = useState<MediaStream>();
  console.log(streamId);

  const peerConnection = useRef<RTCPeerConnection>();

  const startStreaming = async (remoteDescription: any) => {
    peerConnection.current = new RTCPeerConnection({
      iceServers: []
    });

    peerConnection.current.onaddstream = (event: any) => {
      console.log('on add stream');
      setRemoteStream(event.stream);

      if (onJoined) {
        onJoined();
      }
    };

    peerConnection.current.onremovestream = () => console.log('stream removed');

    peerConnection.current.onconnectionstatechange = event =>
      console.log('state change connection: ', peerConnection.current?.connectionState);

    peerConnection.current.onsignalingstatechange = () => console.log(peerConnection.current?.signalingState);

    peerConnection.current.onicecandidateerror = console.log;

    peerConnection.current.onicecandidate = (event: any) => {
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

    const answer = (await peerConnection.current.createAnswer()) as any;
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
      takeCandidate: data => {
        console.log('onIceCandidate remote');
        peerConnection.current?.addIceCandidate({
          candidate: data?.candidate || '',
          sdpMLineIndex: Number(data?.label) || 0,
          sdpMid: data?.id || ''
        });
      },
      takeConfiguration: async data => {
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

  useEffect(() => {
    signalingChannel.current.open();

    return () => {
      signalingChannel.current.close();
    };
  }, []);

  if (!remoteStream) return null;

  return (
    !!remoteStream && (
      <RemoteView zOrder={1} streamURL={remoteStream?.toURL()} style={{ flex: 1 }} objectFit="contain" />
    )
  );
};

const styles = StyleSheet.create({
  bottom: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-evenly',
    marginBottom: 30
  }
});
