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
  listModel: {
    marginTop: 15,
  },
  textLive: {
    textAlign: "center",
    color: colors.light,
  },
  headerContainer: {
    marginTop: 10,
    marginHorizontal: 10,
  },

  svgCurve: {
    position: "absolute",
    width: Dimensions.get("window").width,
  },
  headerText: {
    fontSize: 30,
    fontWeight: "bold",
    // change the color property for better output
    color: "#fff",
    textAlign: "center",
    marginTop: 0,
  },

  radioModel: {
    fontWeight: "bold",
    color: colors.lightText,
    textAlign: "center",
    marginTop: 0,
    alignContent: "center",
    alignSelf: "center",
  },
  modal: {
    height: 220,
    width: width - 80,
    paddingTop: 10,
    backgroundColor: "white",
    borderRadius: 10,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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

  carouselItem: {
    aspectRatio: 3 / 4,
  },

  carouselImage: {
    flex: 1,
    width: undefined,
    height: undefined,
    resizeMode: "cover",
  },

  range: {
    alignSelf: "center",
    height: 40,
    alignItems: "center",
    marginVertical: 30,
  },
  rangeHastag: {
    alignSelf: "flex-start",
    height: 40,
    alignItems: "flex-start",
    marginVertical: 30,
  },

  btnLoadMore: {
    marginTop: 20,
    alignSelf: "center",
  },

  btnFollow: {
    marginTop: 5,
    alignItems: "center",
  },

  rangeNumber: {
    alignItems: "center",
  },
});
export default styles;
