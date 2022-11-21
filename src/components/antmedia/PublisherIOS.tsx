import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useAntMedia } from 'rn-antmedia';
import { config } from 'config';

import { LocalView, PublicStreamView } from './styles';
import { WEBRTC_ADAPTOR_INFORMATIONS } from './constants';

type fn = () => void;

interface Props {
  streamId: string;
  onChange: Function;
}

const PublisherIOS = ({ streamId, onChange }: Props) => {
  const publishStatusRef = useRef<boolean>(false);
  const [localMedia, setLocalMedia] = useState('');
  const events = useRef<{
    [key: string]: fn;
  }>({});
  const adaptor = useAntMedia({
    debug: true,
    url: config.ANT_SIGNALING_URL,
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
          break;
        case 'joined':
          console.log('joined', 'join');
          this.initPeerConnection(streamId, 'publish');
          this.publish(streamId);
          onChange(WEBRTC_ADAPTOR_INFORMATIONS.PUBLISH_STARTED);
          break;
        default:
          break;
      }
    },
    callbackError: (err, data) => {
      console.error('callbackError', err, data);
    }
  });

  const handleLeave = useCallback(() => {
    if (!adaptor) {
      return;
    }
    adaptor.leave(streamId);
    onChange(WEBRTC_ADAPTOR_INFORMATIONS.PUBLISH_FINISHED);
  }, [adaptor]);

  const handleJoin = () => {
    if (publishStatusRef.current) return;
    if (!adaptor || !streamId) {
      return;
    }

    adaptor.join(streamId);
    publishStatusRef.current = true;
  };

  useEffect(() => {
    events.current.handleLeave = handleLeave;
  }, [handleLeave]);

  useEffect(() => {
    if (adaptor) {
      const verify = () => {
        if (adaptor.localStream.current && adaptor.localStream.current.toURL()) {
          return setLocalMedia(adaptor.localStream.current.toURL());
        }
        setTimeout(verify, 3000);
      };
      verify();

      // handle join stream
      if (!publishStatusRef.current) {
        handleJoin();
      }
    }

    const toLeave = events.current.handleLeave;
    return () => {
      if (streamId) {
        toLeave();
        if (adaptor) {
          adaptor.leave(streamId);
        }
      }
    };
  }, [adaptor]);

  if (!localMedia) {
    return null;
  }

  return <PublicStreamView zOrder={2} objectFit="contain" streamURL={localMedia} />;
};

export default PublisherIOS;
