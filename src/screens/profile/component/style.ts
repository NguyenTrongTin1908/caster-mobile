import { StyleSheet } from "react-native";
import { colors, Fonts, Sizes } from "utils/theme";
import { Dimensions } from "react-native";
import { background } from "native-base/lib/typescript/theme/styled-system";
import { getStatusBarHeight } from "react-native-status-bar-height";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  btnGolive: {
    left: 0.0,
    top: 15,
    width: 100,
    height: 70,
    backgroundColor: colors.secondary,
  },

  postImageStyle: {
    // width: '100%',
    alignSelf: "center",
    height: 130,
    borderRadius: Sizes.fixPadding - 5.0,
    marginTop: Sizes.fixPadding - 5.0,
    width: width / 3.1,
    flexDirection: "row",
    justifyContent: "center",
    marginHorizontal: Sizes.fixPadding - 8.0,
  },
  userProfilePhotoStyle: {
    width: 100.0,
    height: 100.0,
    borderRadius: 50.0,
  },

  settingFeeImage: {
    width: 50.0,
    height: 50.0,
    borderRadius: 50.0,
  },

  settingFeeStack: {
    alignItems: "center",
    marginVertical: 40,
  },
  userProfilePhotoBlurContentStyle: {
    width: 100.0,
    height: 100.0,
    borderRadius: 50.0,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000000,
  },

  listModel: {
    marginTop: 15,
  },

  textLive: {
    textAlign: "center",
    color: colors.light,
  },
  textName: {
    color: colors.lightText,
    // marginTop:40.0,
    // alignSelf: 'center',
    fontSize: 13.0,
    fontWeight: "bold",
  },

  textVerification: {
    textAlign: "center",
    color: colors.light,
  },

  modelScrollList: {
    width: "100%",
    height: undefined,
    aspectRatio: 1,
    marginVertical: "auto",
    marginHorizontal: "auto",
  },

  avContainer: {
    height: 120,
    width: 120,
    borderRadius: 200,
    backgroundColor: "white",
    position: "absolute",
    alignSelf: "center",
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  avBlueRound: {
    height: "90%",
    width: "90%",
    borderRadius: 200,
    borderWidth: 5,
    borderColor: "blue",
    alignItems: "center",
    justifyContent: "center",
  },
  avEdit: {
    height: 120,
    width: 120,
    borderRadius: 200,
    position: "absolute",
    top: 70 + getStatusBarHeight(true),
    left: 0,
    zIndex: 9999,
  },

  imageVerification: {
    flex: 1,
    height: 120,
    width: 120,
    borderRadius: 200,
    alignSelf: "flex-start",
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

  userCoverStyle: {
    position: "absolute",
    top: 10,
  },
  profileScrollView: {
    flex: 1,
    backgroundColor: colors.darkText,
    marginVertical: 10,
  },
  bottomSheetContentStyle: {
    backgroundColor: colors.lightText,
    paddingTop: Sizes.fixPadding + 5.0,
    paddingBottom: Sizes.fixPadding,
  },

  editDatePicker: {
    fontSize: 24.0,
    color: colors.lightText,

    width: "100%",
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
  headerWrapStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Sizes.fixPadding + 5.0,
  },

  dialogContainerStyle: {
    borderRadius: Sizes.fixPadding,
    width: width - 70,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    paddingTop: -Sizes.fixPadding,
    paddingBottom: Sizes.fixPadding * 2.0,
  },
  cancelButtonStyle: {
    flex: 0.5,
    backgroundColor: "#E0E0E0",
    borderRadius: Sizes.fixPadding - 5.0,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Sizes.fixPadding,
    marginRight: Sizes.fixPadding + 5.0,
  },
  okButtonStyle: {
    flex: 0.5,
    backgroundColor: colors.primary,
    borderRadius: Sizes.fixPadding - 5.0,
    paddingVertical: Sizes.fixPadding,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Sizes.fixPadding + 5.0,
  },
  okAndCancelButtonContainerStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Sizes.fixPadding * 2.0,
    marginHorizontal: Sizes.fixPadding + 5.0,
  },
  bottomSheetContain: {
    backgroundColor: colors.transparent,
    paddingTop: Sizes.fixPadding + 400,
  },

  profileForm: {
    marginTop: 40,
  },

  deleteText: { textAlign: "center", color: "red" },

  btn: { width: 58, height: 18, backgroundColor: "#78B7BB", borderRadius: 2 },
  textRow: { textAlign: "center" },
  head: { height: 40, backgroundColor: "#808B97" },
  row: { flexDirection: "row", backgroundColor: colors.lightText },
  textNoti: { textAlign: "center" },
});

export default styles;
