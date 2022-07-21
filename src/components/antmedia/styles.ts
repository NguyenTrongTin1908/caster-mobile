import { RTCView } from 'react-native-webrtc';
import styled from 'styled-components/native';

export const RemoteView = styled(RTCView)`
  position: absolute;
  flex: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: #000000;
`;

export const LocalView = styled(RTCView)`
  width: 120px;
  height: 120px;
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
  background: #000000;
  /* align-self: flex-end; */
  /* margin-top: auto; */
`;
