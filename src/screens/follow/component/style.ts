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
checkBoxFollow: {
  position: 'absolute',
  right: 0,
  marginVertical: Sizes.fixPadding * 2,

  // top:55,
  // color: colors.secondary,


},

  listModel: {
    marginVertical: Sizes.fixPadding * 2,
  },

  textLive:{
    textAlign: 'center',
    color: colors.light
  }

})

export default styles;

