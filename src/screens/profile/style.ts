import { StyleSheet } from 'react-native';
import { colors, Fonts, Sizes } from 'utils/theme';
import { Dimensions} from "react-native";
import { background, color } from 'native-base/lib/typescript/theme/styled-system';
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  imgCover: {
    width:width ,
    height: 100.0,

},
container: {
  flex: 1,
},
textName:{
  color:colors.lightText,
  marginTop:40.0,
  alignSelf: 'center',
  fontSize: 23.0,
  fontWeight: 'bold',
},
subText:{
  color:colors.lightText,
  alignSelf: 'center',
  fontWeight: 'bold',
},
converPhoto: {
  width: '100%',
  height: 130,
},
avContainer: {
  height: 120,
  width: 120,
  borderRadius: 200,
  backgroundColor: 'white',
  position: 'absolute',
  alignSelf: 'center',
  marginTop: 50,
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
postImageStyle: {
  // width: '100%',
  alignSelf: 'center',
  height: 130,
  borderRadius: Sizes.fixPadding - 5.0,
  marginTop: Sizes.fixPadding - 5.0,
  // width: width / 3.3,
  flexDirection: 'row',
  justifyContent: 'center',
  marginHorizontal: Sizes.fixPadding - 8.0,
  width : Math.floor(
    (width - ((Sizes.fixPadding - 8.0)+(Sizes.fixPadding - 5.0)) * (3 - 1)) / 3
  )
},
editProfileButtonStyle: {
  borderColor: colors.secondary,
  borderWidth: 2.0,
  borderRadius: Sizes.fixPadding - 5.0,
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: Sizes.fixPadding - 5.0,
  paddingHorizontal: Sizes.fixPadding * 2.0,
  fontSize: 15.0,
  margin:1.0
},
profileImageStyle: {
  width: 90.0,
  height: 90.0,
  borderWidth: 2.0,
  borderColor: colors.light,
  borderRadius: 45.0,
},
listFeeds: {
  height: '100%',
  width: '100%',
}
});
export default styles;
