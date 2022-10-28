import React, { useEffect, useRef, useState } from "react";
import { Button, Dimensions, StyleSheet, View } from "react-native";
import { SignalingChannel } from "./SignalingChannel";
import { WEBRTC_ADAPTOR_INFORMATIONS } from "components/antmedia/constants";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  mediaDevices,
  MediaStream,
  RTCPeerConnection,
  RTCView,
} from "react-native-webrtc";
import { config } from "config";
import { LocalView } from "./styles";

export const Private = ({
  streamId = "",
  // styles = {
  //   width: 193,
  //   height: 136,
  //   position: "absolute",
  //   bottom: 60,
  //   right: 12,
  //   zIndex: 2,
  //   backgroundColor: "#cbb967",
  // },
  onChange,
}) => {
  const [started, setStarted] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [audiMuted, setAudioMuted] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  console.log("streamId ", streamId);

  const [localStream, setLocalStream] = useState<MediaStream>();

  const localStreamRef = useRef<MediaStream>();

  const peerConnection = useRef<RTCPeerConnection>();

  const startStreaming = async () => {
    try {
      if (!localStreamRef?.current) {
        return;
      }

      peerConnection.current = new RTCPeerConnection({
        iceServers: [
          {
            url: "stun:stun.l.google.com:19302",
          },
        ],
      });
      // console.log('peerConnection.current', peerConnection.current);
      peerConnection.current?.addStream(localStreamRef.current);

      peerConnection.current.onsignalingstatechange = () =>
        // console.log(peerConnection.current?.signalingState);

        (peerConnection.current.onicecandidateerror = console.log);
      peerConnection.current.onicecandidate = (event) => {
        const candidate = event.candidate;
        if (candidate && signalingChannel.current?.isChannelOpen()) {
          signalingChannel.current?.sendJSON({
            command: "takeCandidate",
            streamId,
            label: candidate.sdpMLineIndex.toString(),
            id: candidate.sdpMid,
            candidate: candidate.candidate,
          });
        }
      };

      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
    } catch (e) {
      console.log(e);
    }
  };

  const signalingChannel = useRef<SignalingChannel>(
    new SignalingChannel(config.ANT_SIGNALING_URL, {
      onopen: () => {
        signalingChannel.current?.sendJSON({
          command: "publish",
          streamId,
        });
        onChange(WEBRTC_ADAPTOR_INFORMATIONS.INITIALIZED);
      },
      start: async () => {
        signalingChannel.current?.sendJSON({
          command: "takeConfiguration",
          streamId,
          type: "offer",
          sdp: peerConnection?.current?.localDescription?.sdp,
        });
        onChange(WEBRTC_ADAPTOR_INFORMATIONS.PUBLISH_STARTED);
      },
      stop: () => {
        console.log("stop called");
        onChange(WEBRTC_ADAPTOR_INFORMATIONS.PUBLISH_FINISHED);
      },
      takeCandidate: (data) => {
        // console.log("onIceCandidate remote");
        peerConnection.current?.addIceCandidate({
          candidate: data?.candidate || "",
          sdpMLineIndex: Number(data?.label) || 0,
          sdpMid: data?.id || "",
        });
      },
      takeConfiguration: (data) => {
        // console.log("got answer")
        const answer = data?.sdp || "";
        peerConnection.current?.setRemoteDescription({
          sdp: answer,
          type: "answer",
        });
      },
    })
  );

  const start = async () => {
    if (!started) {
      setStarted(true);
      await startStreaming();
      signalingChannel.current?.open();
      return;
    }
  };

  const renderButtons = () => {
    return (
      <View style={styles.bottom}>
        <Button
          title={started ? "Stop" : "Start"}
          color="red"
          onPress={async () => {
            if (!started) {
              setStarted(true);
              await startStreaming();
              signalingChannel.current?.open();
              return;
            }

            setStarted(false);
            peerConnection.current?.close();
            signalingChannel.current.close();
          }}
        />
        {/* <Button
        title={audiMuted ? "UMA" : "MA"}
        color="red"
        onPress={() => {
          const localStreams = peerConnection.current?.getLocalStreams() || [];
          for (const stream of localStreams) {
            stream.getAudioTracks().forEach((each) => {
              each.enabled = audiMuted;
            });
          }
          setAudioMuted((m) => !m);
        }}
      />
      <Button
        title={videoMuted ? "UMV" : "MV"}
        color="red"
        onPress={() => {
          const localStreams = peerConnection.current?.getLocalStreams() || [];
          for (const stream of localStreams) {
            stream.getVideoTracks().forEach((each) => {
              each.enabled = videoMuted;
            });
          }
          setVideoMuted((m) => !m);
        }}
      />
      <Button
        title="SC"
        color="red"
        onPress={() => {
          const localStreams = peerConnection.current?.getLocalStreams() || [];
          for (const stream of localStreams) {
            stream.getVideoTracks().forEach((each) => {
              // @ts-ignore
              // easiest way is to switch camera this way
              each._switchCamera();
            });
          }
          setIsFrontCamera((c) => !c);
        }}
      /> */}
      </View>
    );
  };

  useEffect(() => {
    const getStream = async () => {
      let sourceId;
      const sourceInfos = await mediaDevices.enumerateDevices();
      for (const info of sourceInfos) {
        if (
          info.kind == "videoinput" && info.facing == isFrontCamera
            ? "user"
            : "environment"
        ) {
          sourceId = info.deviceId;
        }
      }

      const media = await mediaDevices.getUserMedia({
        audio: true,
        video: {
          facingMode: isFrontCamera ? "user" : "environment",
          mandatory: {
            minFrameRate: 30,
            minHeight: Dimensions.get("window").height,
            minWidth: Dimensions.get("window").width,
          },
          optional: sourceId,
        },
      });

      if (media) {
        localStreamRef.current = media as MediaStream;
        setLocalStream(media as MediaStream);

        // start to call
        // console.log('start to call...');
        start();
      }
    };

    getStream();
  }, []);

  useEffect(() => {
    return () => {
      signalingChannel.current.close();
    };
  }, []);

  if (!!localStream)
    return (
      <LocalView
        zOrder={2}
        streamURL={localStream?.toURL()}
        mirror={isFrontCamera}
        objectFit="contain"
      />
    );

  return null;
};

const styles = StyleSheet.create({
  bottom: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
    marginBottom: 0,
    zIndex: 10000,
  },
});
