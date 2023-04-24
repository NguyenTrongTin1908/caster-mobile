import { Text, View } from "native-base";
import React from "react";
import { Image, StyleSheet } from "react-native";
// import { getStatusBarHeight } from 'react-native-status-bar-height';

interface Props {
  children?: React.ReactElement;
  containerStyle?: { [key: string]: any };
  headerStyle?: { [key: string]: any };
  header?: {
    align: any;
    title: string;
    showAvatar?: boolean;
    avatar?: string;
  };
}

export default function CustomHeader({
  children,
  containerStyle = {},
  headerStyle = {},
  header = {
    align: "center",
    title: "",
    showAvatar: false,
    avatar: "",
  },
}: Props): React.ReactElement {
  const { avatar, showAvatar } = header;
  return (
    <View
      style={{
        position: "absolute",
        top: 10,
        left: 0.0,
        right: 0.0,
        ...containerStyle,
      }}
    >
      {showAvatar ? (
        <Image
          source={
            avatar
              ? { uri: avatar }
              : require("../../assets/avatar-default.png")
          }
          style={{
            width: 40,
            height: 40,
            borderRadius: 35.0,
            borderColor: "blue",
            borderWidth: 1.0,
            alignSelf: "center",
          }}
        />
      ) : (
        <Text textAlign={header.align || "center"} style={{ ...headerStyle }}>
          {header.title || ""}
        </Text>
      )}
      {children}
    </View>
  );
}
