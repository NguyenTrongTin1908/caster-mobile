import React from "react";
import { Image, StyleSheet } from "react-native";
import { View, Text, Box } from "native-base";
import { TouchableOpacity } from "react-native";
import { colors, Sizes } from "utils/theme";
import styles from "./style";
import FontAwesome from "react-native-vector-icons/FontAwesome";
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
  onTabChange: Function;
  tab: string;
  tabs: {
    key: string;
    title: string;
  }[];
  style?: { [key: string]: any };
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
  onTabChange,
  tab,
  tabs,
  style = {},
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
      <View style={{ ...styles.tabView, ...style }}>
        {tabs.map((item, index) => {
          return (
            <Box
              flexDirection="row"
              alignItems={"center"}
              justifyContent={"center"}
              key={index}
            >
              <TouchableOpacity onPress={() => onTabChange(item.key)}>
                <FontAwesome
                  name={item.key === "video" ? "video-camera" : "camera"}
                  style={{
                    color: tab === item.key ? colors.tabView : "#979797",
                    fontSize: 30,
                  }}
                />
              </TouchableOpacity>
              {index % 2 == 0 ? (
                <View
                  key={`${index}-text`}
                  style={{
                    paddingHorizontal: Sizes.fixPadding + 10.0,
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
                    <Text
                      textAlign={header.align || "center"}
                      style={{ ...headerStyle }}
                    >
                      {header.title || ""}
                    </Text>
                  )}
                </View>
              ) : null}
            </Box>
          );
        })}
      </View>
    </View>
  );
}
