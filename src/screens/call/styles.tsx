
import { Platform, StyleSheet } from "react-native";
import { colors, Fonts, Sizes } from "utils/theme";
import { Dimensions, StatusBar } from "react-native";

const { width, height } = Dimensions.get("window");
let deviceH = Dimensions.get("screen").height;
const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 24;
let bottomNavBarH = deviceH - height + STATUS_BAR_HEIGHT;
const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 100,
    width: "100%",
    height: "100%",
    padding: 5
  },
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

  rightBarStream: {
    position: "absolute",
    marginTop: Sizes.fixPadding + 160.0,
    alignItems: "center",
    alignSelf: "flex-end",
    zIndex: 1000,
  },

  iconStream: {
    marginTop: Sizes.fixPadding + 40.0,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  footerGolive: {
    flexDirection: "column",
    justifyContent: "space-around",
  },
  goliveButton: {
    backgroundColor: colors.gray,
    borderColor: colors.darkText,
    borderWidth: 2.0,
    borderRadius: Sizes.fixPadding - 5.0,
    justifyContent: "center",
    textAlign: "center",
    width: "100%",
    height: 50.0,
  },
  btnText: {
    color: colors.lightText,
    // alignSelf: 'center',
    textAlign: "center",
    fontWeight: "bold",
  },

  bg1: { backgroundColor: "#1ED760" },
  bg2: { backgroundColor: "#FE294D" },

  textName: {
    marginTop: Sizes.fixPadding - 7.0,
    color: colors.lightText,
  },

  btnEndStream: {
    color: colors.darkText,
    backgroundColor: colors.secondary,
    marginTop: Sizes.fixPadding + 150.0,
  },
});

export default styles;
