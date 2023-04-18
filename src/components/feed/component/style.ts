import { Platform, StyleSheet } from "react-native";
import { colors, Fonts, Sizes } from "utils/theme";
import { Dimensions, StatusBar } from "react-native";
import { unset } from "lodash";

const { width, height } = Dimensions.get("window");
let deviceH = Dimensions.get("screen").height;
const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 24;
let bottomNavBarH = deviceH - height + STATUS_BAR_HEIGHT;
const styles = StyleSheet.create({
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
  bottomContainer: {
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingBottom: Sizes.fixPadding * 2.5,
  },
  songRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Sizes.fixPadding * 2.0,
  },
  rightContainer: {
    position: "absolute",
    top: 100,
    right: Sizes.fixPadding,
    justifyContent: "flex-start",
    height: 320,
  },

  leftContainer: {
    position: "absolute",
    top: 100,
    height: 250,
    justifyContent: "space-around",
    marginRight: 5,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#fff",
  },
  iconContainer: {
    alignItems: "center",
  },
  profilePictureAddButtonWrapStyle: {
    position: "absolute",
    bottom: -10.0,
    width: 20.0,
    height: 20.0,
    borderRadius: 10.0,
    backgroundColor: colors.darkText,
    alignItems: "center",
    justifyContent: "center",
  },
  postSongImageWrapStyle: {
    marginRight: Sizes.fixPadding - 5.0,
    backgroundColor: "#222222",
    width: 45.0,
    height: 45.0,
    borderRadius: 22.5,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
    marginBottom: Sizes.fixPadding - 30.0,
  },
  relatedAndForYouInfoWrapStyle: {
    position: "absolute",
    top: 20.0,
    left: 0.0,
    right: 0.0,
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  followButtonWrapStyle: {
    marginBottom: Sizes.fixPadding + 5.0,
    backgroundColor: colors.darkText,
    borderRadius: Sizes.fixPadding - 5.0,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Sizes.fixPadding + 5.0,
    paddingHorizontal: Sizes.fixPadding * 8.0,
  },
  relatedInfoWrapStyle: {
    width: width - 100,
    height: 390,
    borderRadius: Sizes.fixPadding,
    alignItems: "center",
    overflow: "hidden",
  },

  video: {
    height: Dimensions.get("window").width * (9 / 16),
    width: Dimensions.get("window").width,
    backgroundColor: "black",
  },
  fullscreenVideo: {
    height: Dimensions.get("window").width,
    width: Dimensions.get("window").height,
    backgroundColor: "black",
  },
  text: {
    marginTop: 30,
    marginHorizontal: 20,
    fontSize: 15,
    textAlign: "justify",
  },
  fullscreenButton: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "flex-end",
    alignItems: "center",
    paddingRight: 10,
  },
  controlOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#000000c4",
    justifyContent: "space-between",
  },

  videoHelp: {
    height: "100%",
    width: "100%",
    backgroundColor: "black",
  },
  fullscreenVideoHelp: {
    height: 400,
    alignSelf: "flex-start",
    width: "100%",
    backgroundColor: "black",
  },
});

export default styles;