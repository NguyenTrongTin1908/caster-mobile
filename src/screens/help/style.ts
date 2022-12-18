import { StyleSheet } from "react-native";
import { colors, Fonts, Sizes } from "utils/theme";
import { Dimensions } from "react-native";
import { background } from "native-base/lib/typescript/theme/styled-system";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { RectButton } from "react-native-gesture-handler";
import { registerGlobals } from "react-native-webrtc";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listModel: {
    marginTop: 15,
  },

  notificationRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    maxHeight: 50,
    marginVertical: 20 + getStatusBarHeight(true),
    marginHorizontal: Sizes.fixPadding - 5.0,
  },

  firstCategory: {
    height: 100,
    width: "95%",
    backgroundColor: colors.primary,
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 50,
  },

  listCategory: {
    flex: 1,
    height: 100,
    margin: 8,
    backgroundColor: colors.primary,
    borderRadius: 4,
    justifyContent: "center",
  },

  textCategory: {
    ...Fonts.whiteColor16Bold,
    alignSelf: "center",
  },

  detailContainer: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    backgroundColor: colors.lightText,
  },

  videoDetail: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.darkText,
  },

  videoContainer: {
    width: "100%",
    height: 400,
  },

  htmlDetail: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.lightText,
  },
  topDetail: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },

  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#fff",
  },
});

export default styles;
