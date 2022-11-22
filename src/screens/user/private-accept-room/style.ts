import { Platform, StyleSheet } from 'react-native';
import { colors, Fonts, Sizes } from 'utils/theme';
import { Dimensions, StatusBar } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';


const { width, height } = Dimensions.get('window');
let deviceH = Dimensions.get('screen').height;
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
  switchBox: {

    marginTop:100,
    flexDirection:"column",
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.lightText,
    padding : 5


  },
  textName:{
    color:colors.lightText,
    marginTop:112.0,
    alignSelf: 'center',
    fontSize: 23.0,
    fontWeight: 'bold',
  },
  converPhoto: {
    width: '100%',
    height: 80,
  },
  avContainer: {
    height: 120,
    width: 120,
    borderRadius: 200,
    position: 'absolute',
    alignSelf: 'center',
    marginTop: getStatusBarHeight(true) +35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avEdit: {
    height: 120,
    width: 120,
    borderRadius: 200,
    position: 'absolute',
    alignSelf: 'center',
    marginTop: 100 + getStatusBarHeight(true),
    zIndex: 9999,
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
  moderatorBox: {


    flex:1,
    marginTop: 30,
    flexDirection:"row",
    justifyContent: 'space-between',


  },
  footerGolive: {
    flexDirection:"column",
    justifyContent:"space-around",
    marginBottom:20

  },
  termBox: {
    marginTop:10,
    flexDirection:"row",
    justifyContent:"space-between",
    color:colors.lightText

  },
  subText:{
    color:colors.lightText,
    // alignSelf: 'center',
    fontWeight: 'bold',
  },

  btnText: {
    color:colors.lightText,
    // alignSelf: 'center',
    textAlign:"center",
    fontWeight: 'bold',
  },

  goliveButton: {
    backgroundColor: colors.gray,
    borderColor: colors.darkText,
    borderWidth: 2.0,
    borderRadius: Sizes.fixPadding - 5.0,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf:"center",
    textAlign:"center",
    paddingVertical: Sizes.fixPadding - 3.0,
    width: 150.0,
    height:80.0,
    margin:2.0,


  },

  statusPrivateBox: {
    flex: 1,
    flexDirection:"row",
    justifyContent: 'center',


  },
  privateChatPrice: {
    justifyContent:"center",
    flexDirection: "row",


  },
  privateTextLicense: {
    justifyContent:"center",
    flexDirection: "row",
    padding:Sizes.fixPadding + 10.0,
    fontSize: Sizes.fixPadding + 10.0,
    marginBottom: Sizes.fixPadding

  },
  privateChatFee: {
    justifyContent:"space-between",
    flexDirection: "row",


  },
  privateAcceptLicense: {
    justifyContent:"space-between",
    flexDirection: "row",


  },
  notifySection: {
    width : "50%",
    justifyContent:"center",
    alignItems:"center",
    alignSelf: "center",
    textAlign: "center",
    backgroundColor: colors.lightText


  },
  textCenter: {},


  privatePriceChatSwitch: {
    justifyContent:"center",
    flexDirection: "column",
    fontSize: Sizes.fixPadding + 10.0,

  },

  statusPrivateButton: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
    borderWidth: 2.0,
    borderRadius: Sizes.fixPadding - 5.0,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf:"center",
    paddingVertical: Sizes.fixPadding - 3.0,
    width: 180.0,
    height:40.0,
    margin:2.0,
  },



});

export default styles;
