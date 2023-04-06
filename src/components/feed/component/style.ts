import { Platform, StyleSheet } from "react-native";
import { colors, Fonts, Sizes } from "utils/theme";
import { Dimensions, StatusBar } from "react-native";

const { width, height } = Dimensions.get("window");
let deviceH = Dimensions.get("screen").height;
const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 24;
let bottomNavBarH = deviceH - height + STATUS_BAR_HEIGHT;
let topPositionMenu = 80 + STATUS_BAR_HEIGHT;
const styles = StyleSheet.create({
  container: { flex: 1 },
  uiContainer: {
    position: "absolute",
    top: topPositionMenu,
    left: 0.0,
    right: 0.0,
    height:
      Platform.OS === "ios"
        ? deviceH - topPositionMenu - STATUS_BAR_HEIGHT
        : deviceH - bottomNavBarH - topPositionMenu - STATUS_BAR_HEIGHT,
    justifyContent: "space-between",
  },
  bottomContainer: {
    paddingHorizontal: 10,
    paddingBottom: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  songRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Sizes.fixPadding * 2.0,
  },
  rightContainer: {
    alignSelf: "flex-end",
    height: 250,
    justifyContent: "flex-start",
    marginRight: 5,
  },
  leftContainer: {
    alignSelf: "flex-start",
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
