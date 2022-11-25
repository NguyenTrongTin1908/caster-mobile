import { Platform, StyleSheet } from "react-native";
import { colors, Fonts, Sizes } from "utils/theme";
import { Dimensions, StatusBar } from "react-native";

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
  switchBox: {
    marginTop: 100,
    flexDirection: "column",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.lightText,
    padding: 5,
  },
  moderatorBox: {
    flex: 1,
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerGolive: {
    flexDirection: "column",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  termBox: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    color: colors.lightText,
  },
  subText: {
    color: colors.lightText,
    // alignSelf: 'center',
    fontWeight: "bold",
  },

  btnText: {
    color: colors.lightText,
    // alignSelf: 'center',
    textAlign: "center",
    fontWeight: "bold",
  },

  goliveButton: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
    borderWidth: 2.0,
    borderRadius: Sizes.fixPadding - 5.0,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    textAlign: "center",
    paddingVertical: Sizes.fixPadding - 3.0,
    width: 150.0,
    height: 80.0,
    margin: 2.0,
  },

  statusPrivateBox: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20.0,
  },
  privatePriceChat: {
    justifyContent: "center",
    flexDirection: "row",
    marginTop: Sizes.fixPadding + 50.0,
  },
  notifySection: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    textAlign: "center",
    marginVertical: Sizes.fixPadding + 50.0,
    backgroundColor: colors.lightText,
  },
  textCenter: {},
  privateChatText: {
    fontSize: Sizes.fixPadding + 8,
  },

  privatePriceChatSwitch: {
    justifyContent: "center",
    flexDirection: "column",
    fontSize: Sizes.fixPadding + 10.0,
  },

  statusPrivateButton: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
    borderWidth: 2.0,
    borderRadius: Sizes.fixPadding - 5.0,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    paddingVertical: Sizes.fixPadding - 3.0,
    width: 180.0,
    height: 40.0,
    margin: 2.0,
  },
});

export default styles;
