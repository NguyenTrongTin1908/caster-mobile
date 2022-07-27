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

