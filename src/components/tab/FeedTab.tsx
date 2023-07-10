import React from "react";
import { View, Text, Box } from "native-base";
import { TouchableOpacity } from "react-native";
import { colors, Sizes } from "utils/theme";
import styles from "./style";
import AntDesign from "react-native-vector-icons/AntDesign";

interface IProps {
  onTabChange: Function;
  tab: string;
  tabs: {
    key: string;
    title: string;
  }[];
  style?: { [key: string]: any };
}
const FeedTab = ({
  onTabChange,
  tab,
  tabs,
  style = {},
}: IProps): React.ReactElement => {
  return (
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
              <AntDesign
                name={item.key === "video" ? "videocamera" : "camera"}
                style={{
                  color: tab === item.key ? colors.tabView : "#979797",
                  fontSize: 35,
                }}
              />
            </TouchableOpacity>
            {index % 2 == 0 ? (
              <View
                key={`${index}-text`}
                style={{
                  paddingHorizontal: Sizes.fixPadding + 5.0,
                  height: 18.0,
                }}
              >
                <Text textAlign={"center"} color={colors.lightText} size={24}>
                  Following
                </Text>
              </View>
            ) : null}
          </Box>
        );
      })}
    </View>
  );
};
export default FeedTab;
