/* eslint-disable camelcase */
import React, { PureComponent, useEffect, useRef, useState } from 'react';
// import withAntmedia from 'src/antmedia';
// import { message } from 'antd';
import { getResponseError } from 'lib/utils';
import { streamService } from '../../services';
import { IPerformer, StreamSettings } from 'src/interfaces';
// import './index.less';
import {
  WebRTCAdaptorConfigs,
  WebRTCAdaptorProps
} from 'src/antmedia/interfaces';
// import videojs from 'video.js';
import { WEBRTC_ADAPTOR_INFORMATIONS } from 'src/antmedia/constants';
// import Router from 'next/router';
// import { isMobile } from 'react-device-detect';
// import MicControlsPlugin from 'src/videojs/mic-controls/plugin';
import { LocalStream } from 'src/antmedia/LocalStream';
import { Container, Image, Text, View } from 'native-base';
import { TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../comment/style';
import { connect } from 'react-redux';
import { isAndroid } from 'utils/common';
import PublisherIOS from '../antmedia/PublisherIOS';
import {Publisher} from '../antmedia/Publisher';

interface IProps extends WebRTCAdaptorProps {
  settings: StreamSettings;
  configs: Partial<WebRTCAdaptorConfigs>;
  setStreamRef?: Function;
  current: IPerformer
}

const LivePublisher = ({settings,configs,setStreamRef,current}:IProps) => {

  const [permissionGranted, setPermissionGranted] = useState(false);
  const [localStreamId, setLocalStreamId] = useState(null as any);
  const [remoteStreamId, setRemoteStreamId] = useState('');
  const [privateRequest, setPrivateRequest] = useState({} as any);
  const localStreamRef = useRef({ id: '' }).current;
  const remoteStreamRef = useRef({
    id: '',
  }).current;

  useEffect(() => {
    if (setStreamRef) {
      setStreamRef({
        start: start(),
      });
    }
  },[])


  const startPublishing= async(idOfStream: string) => {
    // const { webRTCAdaptor, leaveSession, settings } = this.props;
    try {
      const token = await streamService.getPublishToken({
        streamId: idOfStream,
        settings
      });
      // webRTCAdaptor.publish(idOfStream, token);
    } catch (e) {
      const error = await Promise.resolve(e);
      // message.error(getResponseError(error));
      // leaveSession();
    }
  }

  const publish = (streamId: string) => {
    // const { initialized } = this.props;
    // initialized && startPublishing(streamId);
    startPublishing(streamId);

  }

  const start = ()=> {
    // const { initWebRTCAdaptor, initialized, publish_started } = this.props;
    // const { onTrack } = this.props;
    // if (initialized && !publish_started && onTrack) {
    //   startPublishing(onTrack);
    // }

    // initWebRTCAdaptor(this.handelWebRTCAdaptorCallback.bind(this));
  }

 const renderLocalVideo= () =>  {
    if (!localStreamId) return null;

    if (isAndroid()) {
      return <Publisher streamId={localStreamId} />;
    }

    return <PublisherIOS streamId={localStreamId} />;
  };

    return (
      <>
       <Container is-playing>
      <Image
        source={current?.avatar ?{ uri: current?.avatar } : require('../../assets/default-avatar.png')}
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
          source={{ uri: current?.avatar }}
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
          </Text>
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
          style={ { marginRight: 55 }}
        >
          <MaterialCommunityIcons
            name="phone-hangup"
            size={24}
            color="#ffffff"
          />
        </TouchableOpacity>
      </View>
      {renderLocalVideo()}
    </Container>
      </>
    );
  }

const mapStateToProps = (state) => ({
  currentUser: state.user.current,
  activeConversation: state.streamMessage.activeConversation,
  system: { ...state.system },

});


export default connect(mapStateToProps)(LivePublisher);
