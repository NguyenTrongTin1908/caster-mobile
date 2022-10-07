import { StyleSheet } from 'react-native';
import { colors, Fonts, Sizes } from 'utils/theme';
import { Dimensions} from "react-native";
import { background } from 'native-base/lib/typescript/theme/styled-system';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const { width, height } = Dimensions.get('window');



const styles = StyleSheet.create({

  container: {
    flex: 1,
  },
  listModel: {
    marginTop: 15,
  },


  notificationRow: {

    flex : 1,
    flexDirection :"row",
    justifyContent : "space-between",
    maxHeight : 50,
    marginVertical : 20 + getStatusBarHeight(true),
    marginHorizontal: Sizes.fixPadding - 5.0


  },








})

export default styles;

