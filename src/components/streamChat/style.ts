import { Platform, StyleSheet } from 'react-native';
import { colors, Fonts, Sizes } from 'utils/theme';
import { Dimensions, StatusBar } from 'react-native';
import { Center } from 'native-base';
import { color } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
let deviceH = Dimensions.get('screen').height;
let deviceV = Dimensions.get('screen').width;
const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 24;
let bottomNavBarH = deviceH - height + STATUS_BAR_HEIGHT;
const styles = StyleSheet.create({
  container: { flex: 1 },
  uiContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0.0,
    right: 0.0,
    height: Platform.OS === 'ios' ? deviceH - (90 + 47) : deviceH - (bottomNavBarH + 60),
    justifyContent: 'flex-end'
  },
  bottomContainer: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: Sizes.fixPadding * 3.0
  },



  songRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  chatbox: {
    position: "absolute",
    height : 100,
    top: deviceH/2-140

  },
  rightContainer: {
    alignSelf: 'flex-end',
    height: 320,
    justifyContent: 'space-between',
    marginRight: 5
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#fff'
  },
  iconContainer: {
    alignItems: 'center'
  },
  profilePictureAddButtonWrapStyle: {
    position: 'absolute',
    bottom: -10.0,
    width: 20.0,
    height: 20.0,
    borderRadius: 10.0,
    backgroundColor: colors.darkText,
    alignItems: 'center',
    justifyContent: 'center'
  },
  postSongImageWrapStyle: {
    marginRight: Sizes.fixPadding - 5.0,
    backgroundColor: '#222222',
    width: 45.0,
    height: 45.0,
    borderRadius: 22.5,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginBottom: Sizes.fixPadding - 30.0
  },
  tabViewRelated: {
    position: 'absolute',
    top: 20.0,
    left: 0.0,
    right: 0.0,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  followButtonWrapStyle: {
    marginBottom: Sizes.fixPadding + 5.0,
    backgroundColor: colors.darkText,
    borderRadius: Sizes.fixPadding - 5.0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Sizes.fixPadding + 5.0,
    paddingHorizontal: Sizes.fixPadding * 8.0
  },
  relatedInfoWrapStyle: {
    width: width - 100,
    height: 390,
    borderRadius: Sizes.fixPadding,
    alignItems: 'center',
    overflow: 'hidden'
  }
  ,
  chatText : {
    fontSize : Sizes.fixPadding *2,
    color : colors.lightText,
    marginHorizontal: Sizes.fixPadding,
    textAlignVertical:"center",

  },
  chatLine : {
    marginBottom: Sizes.fixPadding,
    flexDirection : "row"

  },
  sendComment: {
    marginLeft: 'auto',
    alignItems:'center',
        justifyContent:'center'


  },
  messageComponent: {
    position: "absolute", top: deviceH/2 -25, left: 0, right: 0,width: deviceV

  },
  emotion: {
   position : 'absolute',
   backgroundColor:colors.lightText,

   top: 0,
   width: deviceV,
   height:deviceH -300,
   maxHeight: deviceH-300,
   overflow:"scroll",



  },
});

export default styles;
