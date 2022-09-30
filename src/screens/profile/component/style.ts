import { StyleSheet } from 'react-native';
import { colors, Fonts, Sizes } from 'utils/theme';
import { Dimensions} from "react-native";
import { background } from 'native-base/lib/typescript/theme/styled-system';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const { width, height } = Dimensions.get('window');



const styles = StyleSheet.create({

  btnGolive: {
    left: 0.0,
    top:15,
    width:100,
    height:70,
  backgroundColor: colors.secondary,



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
userProfilePhotoStyle: {
  width: 100.0,
  height: 100.0,
  borderRadius: 50.0,

},
userProfilePhotoBlurContentStyle: {
  width: 100.0,
  height: 100.0,
  borderRadius: 50.0,
  backgroundColor: 'rgba(0,0,0,0.55)',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000000
},

  listModel: {
    marginTop: 15,
  },

  textLive:{
    textAlign: 'center',
    color: colors.light
  },
  textName:{
    color:colors.lightText,
    // marginTop:40.0,
    // alignSelf: 'center',
    fontSize: 13.0,
    fontWeight: 'bold',
  },

  textVerification: {

    textAlign: 'center',
    color: colors.light

  },

  modelScrollList: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    marginVertical: 'auto',
    marginHorizontal: 'auto',



  },

  avContainer: {
    height: 120,
    width: 120,
    borderRadius: 200,
    backgroundColor: 'white',
    position: 'absolute',
    alignSelf: 'center',
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avBlueRound: {
    height: '90%',
    width: '90%',
    borderRadius: 200,
    borderWidth: 5,
    borderColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avEdit: {
    height: 120,
    width: 120,
    borderRadius: 200,
    position: 'absolute',
    alignSelf: 'center',
    marginTop: 110 + getStatusBarHeight(true),
    zIndex: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },


  imageVerification: {
    flex:1,
    height: 120,
    width: 120,
    borderRadius: 200,
    alignSelf: 'flex-start',

  },



  bgImage: {
    height: '85%',
    width: '85%',
    borderRadius: 200,
    borderWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeNowTick: {
    height: 20,
    width: 20,
    backgroundColor: 'green',
    borderRadius: 30,
    position: 'absolute',
    right: -5,
    bottom: 15,
    borderWidth: 3,
    borderColor: 'white',
  },




})

export default styles;

