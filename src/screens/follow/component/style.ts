import { StyleSheet } from "react-native";
import { colors, Fonts, Sizes } from "utils/theme";
import { Dimensions } from "react-native";
import { background } from "native-base/lib/typescript/theme/styled-system";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  btnGolive: {
    left: 0.0,
    top: 15,
    width: 100,
    height: 70,
    backgroundColor: colors.secondary,
  },
  checkBoxFollow: {
    marginVertical: Sizes.fixPadding,
  },

  listModel: {
    marginVertical: Sizes.fixPadding * 2,
  },

  text: {
    marginVertical: 4,
    color: colors.light,
    fontSize: 22,
  },

  textRight: {
    marginVertical: 4,
    color: colors.light,
    fontSize: 23,
  },

  postImageStyle: {
    alignSelf: "center",
    height: 130,
    borderRadius: Sizes.fixPadding - 5.0,
    marginTop: Sizes.fixPadding - 5.0,
    width: width / 3.1,
    flexDirection: "row",
    justifyContent: "center",
    marginHorizontal: Sizes.fixPadding - 8.0,
  },

  leftContainer: {
    marginHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  rightContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default styles;
