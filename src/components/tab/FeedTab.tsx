import React from "react";
import { View, Text } from "native-base";
import { TouchableOpacity } from "react-native";
import { colors, Sizes } from "utils/theme";
import styles from "./style";

interface IProps {
  onTabChange: Function;
  tab: string;
}
const FeedTab = ({ onTabChange, tab }: IProps): React.ReactElement => {
  return (
    <View style={styles.tabView}>
      <TouchableOpacity onPress={() => onTabChange()}>
        <Text
          style={{
            color: tab === "video" ? colors.lightText : "#979797",
            fontSize: 20,
          }}
        >
          Video
        </Text>
      </TouchableOpacity>
      <View
        style={{
          marginHorizontal: Sizes.fixPadding + 5.0,
          height: 18.0,
          width: 2.0,
          backgroundColor: colors.lightText,
        }}
      />
      <TouchableOpacity onPress={() => onTabChange()}>
        <Text
          style={{
            color: tab === "video" ? "#979797" : colors.lightText,
            fontSize: 20,
          }}
        >
          Photo
        </Text>
      </TouchableOpacity>
    </View>
  );
};
export default FeedTab;
