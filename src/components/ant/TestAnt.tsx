import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useAntMedia } from 'rn-antmedia';
import InCallManager from 'react-native-incall-manager';

import {
  Container,
  Input,
  Label,
  Text,
  Button,
  InputView,
  LocalView,
  RemoteView
} from './styles';
import { Alert } from 'react-native';

const defaultStreamName = 'hello';

type fn = () => void;

const TestAnt: React.FC = () => {
  const [localMedia, setLocalMedia] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const streamNameRef = useRef<string>(defaultStreamName);
  const [remoteMedia, setRemoteStream] = useState<string>('');
  const events = useRef<{
    [key: string]: fn;
  }>({});
  const adaptor = useAntMedia({
    debug: true,
    url: 'wss://streaming.lynxfans.com/LiveApp/websocket',
    // or url: 'ws://server.com:5080/WebRTCAppEE/websocket',
    mediaConstraints: {
      video: {
        mandatory: {
          minFrameRate: 30,
          minHeight: 480,
          minWidth: 640
        },
        optional: [],
        facingMode: 'user'
      },
      audio: true
    },
    sdp_constraints: {
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    },
    bandwidth: 300,
    peerconnection_config: {
      iceServers: [
        {
          url: 'stun:stun.l.google.com:19302'
        }
      ]
    },
    callback(command, data) {
      switch (command) {
        case 'pong':
          // console.log('pong');
          break;
        case 'joined':
          console.log('jined')
          setIsPlaying(true);
          // console.log('adaptor', adaptor)
          this.initPeerConnection('hello', 'publish');
          this.publish('hello');
          break;
        default:
          console.log('comment', command, data)
          Alert.alert(command);
          break;
      }
    },
    callbackError: (err, data) => {
      console.error('callbackError', err, data);
    }
  });

  const handleSetStreamName = useCallback((value) => {
    streamNameRef.current = value || '';
  }, []);

  const handleLeave = useCallback(() => {
    if (!adaptor) {
      return;
    }
    adaptor.leave(streamNameRef.current);
    setIsPlaying(false);
  }, [adaptor]);

  useEffect(() => {
    events.current.handleLeave = handleLeave;
  }, [handleLeave]);

  useEffect(() => {
    const toLeave = events.current.handleLeave;
    return () => {
      if (streamNameRef.current) {
        toLeave();
      }
    };
  }, []);

  const handleJoin = useCallback(() => {
    if (!adaptor || !streamNameRef.current) {
      return;
    }
    console.log('join to', streamNameRef.current);
    adaptor.join(streamNameRef.current);
  }, [adaptor]);

  useEffect(() => {
    if (adaptor) {
      const verify = () => {
        if (
          adaptor.localStream.current &&
          adaptor.localStream.current.toURL()
        ) {
          return setLocalMedia(adaptor.localStream.current.toURL());
        }
        setTimeout(verify, 3000);
      };
      verify();
    }
  }, [adaptor]);

  useEffect(() => {
    console.log('111')
    if (localMedia && isPlaying) {
            // InCallManager.start({ media: 'video' });

      //InCallManager.start({ media: 'video' });
    }
  }, [localMedia, isPlaying]);

  useEffect(() => {
    if (adaptor && Object.keys(adaptor.remoteStreams).length > 0) {
      for (let i in adaptor.remoteStreams) {
        let st =
          adaptor.remoteStreams[i] && 'toURL' in adaptor.remoteStreams[i]
            ? adaptor.remoteStreams[i].toURL()
            : null;
        setRemoteStream(st || '');
        break;
      }
    }
  }, [adaptor]);

  return (
    <Container is-playing={isPlaying}>
      <InputView>
        <Label children="Stream Name" />
        <Input
          defaultValue={defaultStreamName}
          onChangeText={handleSetStreamName}
        />
      </InputView>
      <Button onPress={handleJoin}>
        <Text>Play</Text>
      </Button>

      <RemoteView zOrder={1} objectFit="cover" streamURL={remoteMedia} />
      <LocalView zOrder={2} objectFit="cover" streamURL={localMedia} />
      <Button style={{ marginTop: 'auto' }} onPress={handleLeave}>
        <Text>Stop</Text>
      </Button>
    </Container>
  );
};

export default TestAnt;
