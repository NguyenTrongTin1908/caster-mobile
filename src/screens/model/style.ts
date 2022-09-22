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
  headerContainer: {
    marginTop: 10,
    marginHorizontal: 10
  },

  svgCurve: {
    position: 'absolute',
    width: Dimensions.get('window').width,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    // change the color property for better output
    color: '#fff',
    textAlign: 'center',
    marginTop: 0
  },

  radioModel: {
    fontWeight: 'bold',
    // change the color property for better output
    color: colors.lightText,
    textAlign: 'center',

    marginTop: 0

  },
  modal: {
    height:220,
    width : width - 80,
    paddingTop:10,
    backgroundColor: 'white',
    borderRadius: 10
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },



})
export default styles;
