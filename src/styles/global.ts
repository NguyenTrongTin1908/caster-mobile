import { Platform, StyleSheet } from "react-native";
import { colors, Fonts, Sizes } from "utils/theme";
import { Dimensions, StatusBar } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";

const { width, height } = Dimensions.get("window");
let deviceH = Dimensions.get("screen").height;
const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 24;
let bottomNavBarH = deviceH - height + STATUS_BAR_HEIGHT;
export const global = StyleSheet.create({
  container: { flex: 1 },
  uiContainer: {
    position: "absolute",
    bottom: 0,
    left: 0.0,
    right: 0.0,
    height:
      Platform.OS === "ios"
        ? deviceH - (90 + 47)
        : deviceH - (bottomNavBarH + 60),
    justifyContent: "flex-end",
  },
});
