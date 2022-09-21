import { StyleSheet } from 'react-native';
import { colors, Fonts, Sizes } from 'utils/theme';
import { Dimensions} from "react-native";
import { background } from 'native-base/lib/typescript/theme/styled-system';

const { width, height } = Dimensions.get('window');



const styles = StyleSheet.create({

  btnGolive: {
    left: 0.0,
    top:15,
    width:100,
    height:70,
  backgroundColor: colors.secondary,
},

headerWrapStyle: {
  flexDirection: "row",
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: Sizes.fixPadding + 5.0,
},
userProfilePhotoStyle: {
  width: 100.0,
  height: 100.0,
  borderRadius: 50.0,
  marginTop: Sizes.fixPadding * 2.5,
  marginBottom: Sizes.fixPadding + 5.0,
},
userProfilePhotoBlurContentStyle: {
  width: 100.0,
  height: 100.0,
  borderRadius: 50.0,
  backgroundColor: 'rgba(0,0,0,0.55)',
  alignItems: 'center',
  justifyContent: 'center'
},
bottomSheetContentStyle: {
  backgroundColor: colors.lightText,
  paddingTop: Sizes.fixPadding + 5.0,
  paddingBottom: Sizes.fixPadding,
},
dialogContainerStyle: {
  borderRadius: Sizes.fixPadding,
  width: width - 70,
  paddingHorizontal: Sizes.fixPadding * 2.0,
  paddingTop: -Sizes.fixPadding,
  paddingBottom: Sizes.fixPadding * 2.0
},
cancelButtonStyle: {
  flex: 0.50,
  backgroundColor: '#E0E0E0',
  borderRadius: Sizes.fixPadding - 5.0,
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: Sizes.fixPadding,
  marginRight: Sizes.fixPadding + 5.0,
},
okButtonStyle: {
  flex: 0.50,
  backgroundColor: colors.primary,
  borderRadius: Sizes.fixPadding - 5.0,
  paddingVertical: Sizes.fixPadding,
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: Sizes.fixPadding + 5.0
},
okAndCancelButtonContainerStyle: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: Sizes.fixPadding * 2.0,
  marginHorizontal: Sizes.fixPadding + 5.0
},

postImageStyle: {
  // width: '100%',
  alignSelf: 'center',
  height: 130,
  borderRadius: Sizes.fixPadding - 5.0,
  marginTop: Sizes.fixPadding - 5.0,
  width: width / 3.1,
  flexDirection: 'row',
  justifyContent: 'center',
  marginHorizontal: Sizes.fixPadding - 8.0,
},

  listModel: {
    marginTop: 15,
  },

  textLive:{
    textAlign: 'center',
    color: colors.light
  },

  modelScrollList: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    marginVertical: 'auto',
    marginHorizontal: 'auto',



  }

})

export default styles;

