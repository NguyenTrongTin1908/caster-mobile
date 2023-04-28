import { StyleSheet } from "react-native";
import { colors, Fonts, Sizes } from "utils/theme";
import { Dimensions } from "react-native";
import {
  background,
  border,
} from "native-base/lib/typescript/theme/styled-system";
import { getStatusBarHeight } from "react-native-status-bar-height";

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

  boxWallet: {
    margin: 2,
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
    borderColor: colors.primary,
    borderWidth: 1,
  },

  btn: { width: 58, height: 18, backgroundColor: "#78B7BB", borderRadius: 2 },
  textRow: { textAlign: "center" },
  head: { height: 40, backgroundColor: "#808B97" },
  row: {
    flexDirection: "row",
    backgroundColor: colors.lightText,
    textAlign: "center",
    alignContent: "center",
    justifyContent: "center",
  },
  textNoti: { textAlign: "center" },
});

export default styles;
