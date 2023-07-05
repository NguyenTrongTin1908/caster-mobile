import { StyleSheet } from "react-native";
import { colors, Fonts, Sizes } from "utils/theme";
import { Dimensions } from "react-native";
import {
  background,
  color,
} from "native-base/lib/typescript/theme/styled-system";
import { getStatusBarHeight } from "react-native-status-bar-height";
const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  imgCover: {
    width: width,
    height: 100.0,
  },
  container: {
    flex: 1,
  },

  subText: {
    color: colors.lightText,
    alignSelf: "center",
    fontWeight: "bold",
  },
  converPhoto: {
    width: "100%",
    height: 130,
  },
  avContainer: {
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },

  avBlueRound: {
    height: 120,
    width: 120,
    marginTop: -50,
    borderRadius: 200,
    borderWidth: 3,
    borderColor: "blue",
    alignItems: "center",
    justifyContent: "center",
  },

  profileInfo: {
    marginStart: 10,
    fontWeight: "bold",
  },

  textName: {
    fontSize: 23.0,
    color: colors.lightText,
  },

  bgImage: {
    height: "85%",
    width: "85%",
    borderRadius: 200,
    borderWidth: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  activeNowTick: {
    height: 20,
    width: 20,
    backgroundColor: "green",
    borderRadius: 30,
    position: "absolute",
    right: -5,
    bottom: 15,
    borderWidth: 3,
    borderColor: "white",
  },
  postImageStyle: {
    // width: '100%',
    alignSelf: "center",
    height: 130,
    borderRadius: Sizes.fixPadding - 5.0,
    marginTop: Sizes.fixPadding - 5.0,
    // width: width / 3.3,
    flexDirection: "row",
    justifyContent: "center",
    marginHorizontal: Sizes.fixPadding - 8.0,
    width: Math.floor(
      (width - (Sizes.fixPadding - 8.0 + (Sizes.fixPadding - 5.0)) * (3 - 1)) /
        3
    ),
  },
  followButtonStyle: {
    borderColor: colors.secondary,
    borderWidth: 2.0,
    borderRadius: Sizes.fixPadding - 5.0,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Sizes.fixPadding - 20.0,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    width: 110.0,
    margin: 2.0,
    height: 40.0,
  },
  profileImageStyle: {
    width: 90.0,
    height: 90.0,
    borderWidth: 2.0,
    borderColor: colors.light,
    borderRadius: 45.0,
  },
  listFeeds: {
    height: "100%",
    width: "100%",
  },
  editButtonStyle: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
    borderWidth: 2.0,
    borderRadius: Sizes.fixPadding - 5.0,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Sizes.fixPadding - 3.0,
    width: 110.0,
    height: 40.0,
    margin: 2.0,
  },
  bar: {
    top: 15 + getStatusBarHeight(true),
    left: 0,
    right: 20,
    height: 56,
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "transparent",
  },
  left: {
    top: 0,
    left: 0,
    width: 50,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  right: {
    top: 0,
    right: 0,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
});
export default styles;
