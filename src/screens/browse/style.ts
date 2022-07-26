import { StyleSheet } from 'react-native';
import { colors, Fonts, Sizes } from 'utils/theme';
import { Dimensions} from "react-native";

const { width, height } = Dimensions.get('window');



const styles = StyleSheet.create({
  container: { flex: 1 },
  uiContainer: {
    position: 'absolute',
    bottom: 310.0,
    left: 0.0,
    right: 0.0,
    height: height,
    justifyContent: 'flex-end',
},
bottomContainer: {
    // paddingHorizontal: 10,
    position: 'absolute',
    bottom: -240.0,
    left: 0.0,
    right: 12.0,
    height: height,
    justifyContent: 'flex-end',
    // paddingBottom: Sizes.fixPadding * 3.0,
},
songRow: {
    flexDirection: 'row',
    alignItems: 'center',
},
rightContainer: {
    alignSelf: 'flex-end',
    height: 270,
    justifyContent: 'space-between',
    marginRight: 5,
},
profilePictureAddButtonWrapStyle: {
  position: 'absolute',
  bottom: -10.0,
  width: 20.0, height: 20.0,
  borderRadius: 10.0,
  backgroundColor: colors.dark,
  alignItems: 'center',
  justifyContent: 'center',
},
postSongImageWrapStyle: {
  // marginRight: Sizes.fixPadding - 5.0,
  width: 45.0, height: 45.0,
  borderRadius: 22.5,
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'flex-end',
  // marginBottom: Sizes.fixPadding - 30.0,
},
profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#fff',
},
});

export default styles;
