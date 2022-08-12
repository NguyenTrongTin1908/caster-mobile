import { Colors, Fonts, Sizes } from "../../constants/styles";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  video: {
    // position: 'absolute',
    width: '100%',
    height: 150,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  photo: {
    width: '100%',
    height: 150,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },

  headerWrapStyle: {
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Sizes.fixPadding + 5.0,
  },
  textSwitch: {
    fontSize: 16,

  },
  postInfoWrapStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Sizes.fixPadding,
    marginBottom: Sizes.fixPadding,
  },
  aboutPostTextFieldStyle: {
    backgroundColor: '#101010',
    flex: 1,
    paddingHorizontal: Sizes.fixPadding,
    ...Fonts.whiteColor16Regular,
    borderRadius: Sizes.fixPadding - 5.0,
    marginLeft: Sizes.fixPadding,
  },
  saveToGalleryInfoWrapStyle: {
    marginHorizontal: Sizes.fixPadding + 5.0,
    marginVertical: Sizes.fixPadding,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  commentOnInfoWrapStyle: {
    flexDirection: 'row',
    marginHorizontal: Sizes.fixPadding,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Sizes.fixPadding * 2.0,
    marginBottom: Sizes.fixPadding * 2.0,
  },
  postVideoButtonStyle: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: Sizes.fixPadding + 5.0,
    borderRadius: Sizes.fixPadding - 7.0,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Sizes.fixPadding * 17.0,
  }
});

export default styles