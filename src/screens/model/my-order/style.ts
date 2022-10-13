import { StyleSheet } from 'react-native';
import { colors, Fonts, Sizes } from 'utils/theme';
import { Dimensions} from "react-native";
import { background } from 'native-base/lib/typescript/theme/styled-system';
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({

  orderItem: {
    marginVertical:20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  orderTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  orderText: {
    fontSize: 16,
    color: 'orange',
  },



})
export default styles;
