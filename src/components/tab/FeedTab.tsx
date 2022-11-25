import React from "react";
import { View, Text } from "native-base";
import { TouchableOpacity } from "react-native";
import { colors, Sizes } from "utils/theme";
import styles from "./style";

interface IProps {
  onTabChange: Function;
  tab: string;
  title: string;
}
const FeedTab = ({ onTabChange, tab, title }: IProps): React.ReactElement => {
  return (
    <View style={styles.tabContainer}>
      <Text
        style={{
          color: tab === "video" ? colors.lightText : "#979797",
          fontSize: 15,
        }}
      >
        {title}
      </Text>

      <View style={styles.tabView}>
        <TouchableOpacity onPress={() => onTabChange()}>
          <Text
            style={{
              color: tab === "video" ? colors.tabView : "#979797",
              fontSize: 20,
              marginHorizontal: 7,
            }}
          >
            Video
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onTabChange()}>
          <Text
            style={{
              color: tab === "video" ? "#979797" : colors.tabView,
              fontSize: 20,
              marginHorizontal: 7,
            }}
          >
            Photo
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default FeedTab;
